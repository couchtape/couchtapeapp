
function playlistCtrl($scope, CouchtapeService, SocketIO) {

    var analyser, canvas, canvasContext, audio, source, audioContext = new webkitAudioContext();

    // bar width of the canvas animation
    var joinFreqBars = 20;

    // space between the bars of the canvas animation
    var barsSpace = 3;

    // complete duration of the song
    $scope.duration = '00:00';

    // current time of the song
    $scope.currentTime = '00:00';

    // buffered in %
    $scope.buffered = 0;

    $scope.init = function () {
        console.log('init');
        setupDrawingCanvas();
        draw();
    };

    function createAnalyser(audio) {

        if (analyser) {
            console.log('disconnect');
            analyser.disconnect(audioContext.destination);
            source.disconnect(analyser);
        }

        // Create a new audio source from the <audio> element
        source = audioContext.createMediaElementSource(audio);

        // Create a new analyser
        analyser = audioContext.createAnalyser();

        // Connect up the output from the audio source to the input of the analyser
        source.connect(analyser);

        // Connect up the audio output of the analyser to the audioContext destination i.e. the speakers (The analyser takes the output of the <audio> element and swallows it. If we want to hear the sound of the <audio> element then we need to re-route the analyser's output to the speakers)
        analyser.connect(audioContext.destination);

    }

    function formatTime(seconds) {
        seconds = Math.round(seconds);
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds - (h * 3600)) / 60);
        var s = seconds - (h * 3600) - (m * 60);

        if (h === 0) {
            h = '';
        } else {
            if (h < 10) {
                h = '0' + h;
            }
            h = h + ':'
        }
        if (m < 10) {m = '0' + m;}
        if (s < 10) {s = '0' + s;}

        return h + m + ':' + s;
    }

    function createAudio(file) {

        if (audio) {
            // pause audio
            audio.pause();
            // stop loading audio
            audio.src = '';
        }

        // create new audio
        audio = new Audio();
        audio.src = file;
        audio.preload = 'auto';
        audio.autoplay = 'true';
        $scope.buffered = 0;
        $scope.duration = '00:00';

        audio.addEventListener('loadedmetadata', function () {
            console.log('loadedmetadata', arguments);
            $scope.duration = formatTime(audio.duration);
        }, false);

        audio.addEventListener('loadeddata', function () {
            console.log('loadeddata', arguments);
            createAnalyser(audio);
            audio.volume = '.01';
        }, false);

        audio.addEventListener('progress', function () {
            if (audio.buffered) {
                $scope.$apply(function () {
                    try {
                        $scope.buffered = audio.buffered.end(0) / audio.duration * 100 + '%';
                    } catch (e) {}
                });
            }
            //console.log('progress', arguments);
        }, false);

        audio.addEventListener('ratechange', function () {
            console.log('ratechange', arguments);
        }, false);

        audio.addEventListener('timeupdate', function () {
            $scope.$apply(function () {
                $scope.currentTime = formatTime(audio.currentTime);
            });
        }, false);

        audio.addEventListener('error', function () {
            console.log('error', arguments);
        }, false);

        audio.addEventListener('durationchange', function () {
            console.log('durationchange', arguments);
        }, false);

        audio.addEventListener('ended', function () {
            console.log('ended', arguments);
            $scope.next();
        }, false);


    }

    // Draw the audio frequencies to screen
    function draw() {

        var i,
            freqByteData,
            key,
            joinedFreq = [];

        // Setup the next frame of the drawing
        webkitRequestAnimationFrame(draw);


        if (analyser) {
            // Create a new array that we can copy the frequency data into
            freqByteData = new Uint8Array(analyser.frequencyBinCount);
            // Copy the frequency data into our new array
            analyser.getByteFrequencyData(freqByteData);

            // Clear the drawing display
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            // For each "bucket" in the frequency data, draw a line corresponding to its magnitude
            for (i = 0; i < freqByteData.length; i++) {
                key = Math.floor(i / joinFreqBars);
                if (!joinedFreq[key]) {
                    joinedFreq[key] = 0;
                }
                joinedFreq[key] += freqByteData[i];
            }
            for (i = 0; i < joinedFreq.length; i++) {
                canvasContext.fillRect(i * joinFreqBars, canvas.height - (joinedFreq[i] / joinFreqBars), joinFreqBars - barsSpace, canvas.height);
            }

        }
    }

    // Basic setup for the canvas element, so we can draw something on screen
    function setupDrawingCanvas() {
        canvas = document.getElementById('visualizer');
        canvasContext = canvas.getContext('2d');
        canvasContext.fillStyle = '#000000';
    }




    function nextSong() {
        console.log('next');
        if (!audio) {
            console.log('Audio not ready now! Please wait a moment!');
            return;
        }

        if ($scope.playlist.length === 0) {return;}


        window.setTimeout(function () {

            $scope.$apply(function () {
                $scope.playlist[0].id = 'hide-it';

                if ($scope.playlist[1]) {
                    $scope.playlist[1].class = 'active';
                    $scope.playlist[1].id = '';
                }
                console.log('song classes');

                window.setTimeout(function () {
                    var el = document.getElementById('hide-it');
                    console.log(el);
                    if (el) {
                        el.style.marginTop = '-' + el.clientHeight + 'px';
                        el.style.opacity = 0;
                        var count = 0;
                        el.addEventListener('webkitTransitionEnd', function () {
                            console.log('webkitTransitionEnd');
                            if (count === 0) {
                                $scope.$apply(function () {
                                    $scope.playlist.shift();

                                    if ($scope.playlist.length > 0) {
                                        $scope.currentSong = $scope.playlist[0];
                                        createAudio($scope.currentSong.file);
                                    }
                                });
                            }
                            count++;
                        }, false);
                    }
                });
            });
        });

    }




    var promise = CouchtapeService.getPlaylist();

    $scope.playlist = [];

    promise.then(function (data) {
        if (data.length) {
            $scope.playlist = data;
            $scope.playlist[0].class = 'active';
            $scope.currentSong = $scope.playlist[0];
            createAudio($scope.currentSong.file);
        }
    }, function (reason) {
        console.log(reason);
    });

    SocketIO.on('nextSong', function () {
        console.log('SocketIO.on(nextSong');
        nextSong();
    });

    SocketIO.on('enqueue', function (data) {
        $scope.$apply(function () {
            var start = false;
            if ($scope.playlist.length === 0) {
                start = true;
            }
            $scope.playlist.push(data);
            if (start) {
                $scope.playlist[0].class = 'active';
                $scope.currentSong = $scope.playlist[0];
                createAudio($scope.currentSong.file);
            }
        });
    });

    $scope.next = function () {
        SocketIO.nextSong();
        nextSong();
    };

    $scope.pause = function () {
        if (audio) {
            audio.pause();
        }
    };

    $scope.play = function () {
        if (audio) {
            audio.play();
        }
    };

    //init();
}