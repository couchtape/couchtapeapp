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

    o3djs.require('o3djs.shader');

// init() once the page has finished loading.

    var context;
    var source = 0;
    var jsProcessor = 0;
    window.analyser;
    var analyserView1;

    var phaseL = 0.0;
    var phaseR = 0.0;
    var kBaseFrequency = 440.0;
    var phaseIncrL = 2.0 * Math.PI * 440.0 / 44100.0;
    var phaseIncrR = 2.0 * Math.PI * (kBaseFrequency * 1.1) / 44100.0; // modulate slightly different on right channel
    var kTwoPi = 2.0 * Math.PI;
    var pitchRate = 1.0;
    var currentFile = 0;

    function process(event) {

        // Get left/right input and output arrays
        var inputArrayL = event.inputBuffer.getChannelData(0);
        var inputArrayR = event.inputBuffer.getChannelData(1);
        var outputArrayL = event.outputBuffer.getChannelData(0);
        var outputArrayR = event.outputBuffer.getChannelData(1);

        var n = inputArrayL.length;

         for (var i = 0; i < n; ++i) {
            // Amplitude modulation effect
            outputArrayL[i] = inputArrayL[i];
            outputArrayR[i] = inputArrayR[i];
        }
    }

    function loadSample(url) {
        // Load asynchronously

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        console.log('loadSample');

        request.onload = function() {
            console.log('onload');
            console.log(source.buffer);
            source.buffer = context.createBuffer(request.response, false);
            console.log(source.buffer);
            source.loop = true;
            source.noteOn(0);
            source.gain.value = 1;
            document.getElementById('view1').style.display = '';

            window.clearInterval(interval);
            interval = window.setInterval(function () {
                if (source.buffer.duration < context.currentTime) {
                    window.clearInterval(interval);
                    next();
                }
            }, 100);


            draw();
        };

        request.send();
    }

    if ( !window.requestAnimationFrame ) {

        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                    window.setTimeout( callback, 1000 / 60 );

                };

        } )();

    }

    function draw() {
        analyserView1.doFrequencyAnalysis();
        // setTimeout(draw, 0);
        window.requestAnimationFrame(draw);
    }
    var songId = 0;

    function next() {

        source.gain.value = 0;
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
                                console.log('webkitTransitionEnd');
                                console.log('tv/mp3/' + $scope.songs[songId].file);
                                loadSample('tv/mp3/' + $scope.songs[songId].file);
                                $scope.$apply(function () {
                                    $scope.songs.shift();
                                });
                            }
                            count++;
                        }, false);
                    } else {
                        loadSample('tv/mp3/' + $scope.songs[songId].file);
                    }
                    songId = 1;
                });
            });
        });

    }
    var interval;

    function initAudio() {
        context = new webkitAudioContext();
        source = context.createBufferSource();

        // This AudioNode will do the amplitude modulation effect directly in JavaScript
        jsProcessor = context.createJavaScriptNode(4096);
        jsProcessor.onaudioprocess = process;

        analyser = context.createAnalyser();
        analyser.fftSize = 2048;

        // Connect the processing graph: source -> jsProcessor -> analyser -> destination
        source.connect(jsProcessor);
        jsProcessor.connect(analyser);
        analyser.connect(context.destination);

        // Load the sample buffer for the audio source
        next();
    }

    function init() {
        analyserView1 = new AnalyserView("view1");
        initAudio();
        //analyserView1.setAnalysisType(ANALYSISTYPE_SONOGRAM);
        //analyserView1.setAnalysisType(ANALYSISTYPE_WAVEFORM);
        //analyserView1.setAnalysisType(ANALYSISTYPE_3D_SONOGRAM);
        analyserView1.setAnalysisType(ANALYSISTYPE_FREQUENCY);
        analyserView1.initByteBuffer();
    }

    $scope.currentCover = '';

    $scope.songs = [
    {
        img: 'tv/img/turmstrasse.jpg',
        file: '04 Dazwischen 2.mp3',
        title: 'Dazwischen 2',
        artist: 'Kollektiv Turmstrasse',
        class: '',
        id: ''
    },
    {
        img: 'tv/img/one-by-one.jpg',
        file: '01 All My Life.mp3',
        title: 'All My Live',
        artist: 'Foo Fighters',
        class: '',
        id: ''
    },
    {
        img: 'tv/img/wasting-light.jpg',
        file: '01 Bridge Burning.mp3',
        title: 'Bridge Burning',
        artist: 'Foo Fighters',
        class: '',
        id: ''
    },
    {
        img: 'tv/img/cat-power-sun.jpg',
        file: '01 Cherokee.mp3',
        title: 'Cherokee',
        artist: 'Cat Power',
        class: '',
        id: ''
    },
    {
        img: 'tv/img/foo-fighters-echoes-silence-patience-grace.jpg',
        file: '01-The-Pretender.mp3',
        title: 'The Pretender',
        artist: 'Foo Fighters',
        class: '',
        id: ''
    }
    ];

    $scope.next = function () {
        next();
    };

    init();
}