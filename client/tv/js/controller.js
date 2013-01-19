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
    }


// Wire up the <audio> element with the Web Audio analyser (currently Webkit only)
    function setupWebAudio() {
        audio = document.getElementById('music');
        audio.play();
        audio.addEventListener('ended', function () {
            next();
        });
    }

    $scope.songs = [
        {
            //"img": "/api/image/markusmeineke/a62960e5-e0c7-4a98-8344-da6608c802da/small",
            "img": " ",
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
,
        {
            "img": "/api/image/markusmeineke/a62960e5-e0c7-4a98-8344-da6608c802da",
            "file": "http://gp.lc/01 All My Life.mp3",
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

    $scope.songs[0].class = 'active';
    $scope.currentSong = $scope.songs[0];

    function next() {
        audio.pause();
        console.dir(audio);
        console.log('next');
        console.log($scope.songs);

        if ($scope.songs.length === 0) {return;}

        window.setTimeout(function () {
            $scope.$apply(function () {
                $scope.songs[0].id = 'hide-it';

                $scope.songs[1].class = 'active';
                $scope.songs[1].id = '';
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
                                    $scope.songs.shift();
                                    $scope.currentSong = $scope.songs[0];
                                    audio.load();
                                    window.setTimeout(function () {
                                        audio.play();
                                    }, 1);
                                });
                            }
                            count++;
                        }, false);
                    }
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