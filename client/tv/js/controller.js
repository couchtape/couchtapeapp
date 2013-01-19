angular.module('twitter', ['ngResource']);

function TwitterCtrl($scope, $resource) {
    $scope.twitter = $resource('https://api.twitter.com/1.1/search/:action',
        {action: 'search.json', q: '#dthack', oauth_token: '201316051-XNlVoZVMllaXF6md17wT2UDJ6Zb7nFuyowZpAvMc', callback: 'JSON_CALLBACK'},
        {get: {method: 'JSONP'}});
    $scope.twitter.get();
    $scope.doSearch = function () {
        console.log($scope.searchTerm);

        $scope.twitterResult = $scope.twitter.get({q:$scope.searchTerm});
    };
}

function player($scope) {

}


function playlistCtrl($scope) {


    var analyser, canvas, canvasContext, audio;

    window.addEventListener('load', init, false);

    function init() {
        setupWebAudio();
        setupDrawingCanvas();
        draw();
    }


// Wire up the <audio> element with the Web Audio analyser (currently Webkit only)
    function setupWebAudio() {

        // Get our <audio> element
        audio = document.getElementById('music');
        // Create a new audio context (that allows us to do all the Web Audio stuff)
        var audioContext = new webkitAudioContext();
        // Create a new analyser
        analyser = audioContext.createAnalyser();
        // Create a new audio source from the <audio> element
        var source = audioContext.createMediaElementSource(audio);
        // Connect up the output from the audio source to the input of the analyser
        source.connect(analyser);
        // Connect up the audio output of the analyser to the audioContext destination i.e. the speakers (The analyser takes the output of the <audio> element and swallows it. If we want to hear the sound of the <audio> element then we need to re-route the analyser's output to the speakers)
        analyser.connect(audioContext.destination);

        audio.play();

        audio.addEventListener('ended', function () {
            console.log('ended');
        });
    }

// Draw the audio frequencies to screen
    function draw() {
        // Setup the next frame of the drawing
        webkitRequestAnimationFrame(draw);

        // Create a new array that we can copy the frequency data into
        var freqByteData = new Uint8Array(analyser.frequencyBinCount);
        // Copy the frequency data into our new array
        analyser.getByteFrequencyData(freqByteData);

        // Clear the drawing display
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        // For each "bucket" in the frequency data, draw a line corresponding to its magnitude
        for (var i = 0; i < freqByteData.length; i++) {
            canvasContext.fillRect(i, canvas.height - freqByteData[i], 1, canvas.height);
        }
    }

// Basic setup for the canvas element, so we can draw something on screen
    function setupDrawingCanvas() {
        canvas = document.getElementById('view1');
        canvasContext = canvas.getContext('2d');
        canvasContext.fillStyle = '#ffffff';
    }

    $scope.songs = [
        {
            "img": "/api/image/markusmeineke/a62960e5-e0c7-4a98-8344-da6608c802da",
            //"file": "http://gp.lc/01 All My Life.mp3",
            "file": "http://gp.lc/04 Dazwischen 2.mp3",
            //"file": "/api/get/markusmeineke/a62960e5-e0c7-4a98-8344-da6608c802da",
            "title": "Cherokee",
            "artist": "Cat Power",
            "class": "",
            "id": "a62960e5-e0c7-4a98-8344-da6608c802da",
            "session": "markusmeineke",
            "_id": "50fade7b3fb1560f16000001"
        }
    ];

    var songId = 0;

    $scope.currentSong = $scope.songs[0];

    function next() {

        console.log($scope.songs);

        if ($scope.songs.length === 0) {return;}

        window.setTimeout(function () {
            $scope.$apply(function () {
                $scope.songs[0].class = 'active hide';
                $scope.songs[0].id = 'hide-it';

                $scope.songs[songId].id = '0';
                $scope.songs[songId].class = 'active';
                $scope.currentCover = $scope.songs[songId].img;

                window.setTimeout(function () {

                    var el = document.getElementById('hide-it');
                    if (el) {
                        el.style.marginTop = '-' + el.clientHeight + 'px';
                        el.style.opacity = 0;
                        var count = 0;
                        el.addEventListener('webkitTransitionEnd', function () {
                            if (count === 0) {
                                $scope.$apply(function () {
                                    $scope.currentSong = $scope.songs[songId];
                                    $scope.songs.shift();

                                    // Get the <audio> element started
                                    audio.play();
                                });
                            }
                            count++;
                        }, false);
                    } else {
                        console.log('Loading file: ', $scope.songs[songId].file);
                        $scope.$apply(function () {
                            $scope.currentSong = $scope.songs[songId];

                            console.log($scope.currentSong);
                            // Get the <audio> element started
                            audio.play();
                        });
                    }
                    songId = 1;
                });
            });
        });

    }

    console.log($scope.currentSong);

    $scope.next = function () {
        next();
    };

    //init();
}