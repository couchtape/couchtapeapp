angular.module('couchtapeParty', ['ngResource']);

angular.module('couchtapeParty').service('CouchtapeService', ['$http', '$q', 'Playlist', 'Songs', 'Artists', function ($http, $q, Playlist, Songs, Artists) {

    var getSongs = function () {
        var deferred = $q.defer();

        $http.get('/api/files/'+CONFIG.session).success(function (data, status, headers, config) {
            deferred.resolve(data);
        }).error(function (data , status, headers, config) {
                deferred.reject(data);
            });
        return deferred.promise;
    };

    var addSong2Playlist = function (id) {
        var deferred = $q.defer();

        $http.get('/api/enqueue/' + CONFIG.session + '/' + id).success(function (data) {
            deferred.resolve(data);
        }).error(function (reason) {
                deferred.reject(reason);
            });
        return deferred.promise;
    }

    return {
        getCurrentSong: function () {
            return Songs[0];
        },
// /api/playlist/session/
        getPlaylist: function () {
            var deferred = $q.defer();

            $http.get('/api/playlist/' + CONFIG.session).success(function (data) {
                deferred.resolve(data);
            }).error(function (reason) {
                    deferred.reject(reason);
                });

            return deferred.promise;
        },

        getArtists: function () {
            return Artists;
        },

        getSongs: getSongs,
        addSong2Playlist: addSong2Playlist
    };
}]);


angular.module('couchtapeParty').factory('Playlist', ['Songs', function (Songs) {
    return Songs.slice(0, 8);
}]);

angular.module('couchtapeParty').value('Artists', [
    {
        id: 1,
        name: 'Justice',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },
    {
        id: 2,
        name: 'Daftpunk',
        thumb: 'http://www.fan-lexikon.de/musik/daft-punk/bilder/l/daft-punk-musique-vol-1-1993-2005-album-cover-16294.jpg'
    },
    {
        id: 3,
        name: 'Skrillex',
        thumb: 'http://blog.rebellen.info/wp-content/uploads/2013/01/Skrillex-leaving-e1357245698733.jpg'
    },
    {
        id: 4,
        name: 'Glitchmob',
        thumb: 'http://www.metatroniks.net/wp-content/uploads/2011/01/glitchmob1.jpg'
    }
]);

angular.module('couchtapeParty').value('Songs', [
    {
        title: 'Phantom',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },
    {
        title: 'P.A.R.T.Y',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },

    {
        title: 'Waters of Nazareth',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },

    {
        title: 'Genesis',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },

    {
        title: 'Genesis',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },

    {
        title: 'Genesis',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },
    {
        title: 'Genesis',
        album: 'Cross Symbol',
        artist: 'Justice',
        year: '2007',
        genre: 'Electronica',
        duration: 'what?!',
        thumb: 'http://userserve-ak.last.fm/serve/_/23347675/Cross+justice__cover.jpg'
    },
]);


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


function playlistCtrl($scope, $document, CouchtapeService) {


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
            nextSong();
        });
    }

    $scope.songs = [];

    var songId = 0;

    function nextSong() {
        next();
        audio.pause();
        console.dir(audio);
        console.log('next');
        console.log($scope.songs);

        if ($scope.songs.length === 0) {return;}

        window.setTimeout(function () {
            $scope.$apply(function () {
                $scope.songs[0].id = 'hide-it';

                if ($scope.songs[1]) {
                    $scope.songs[1].class = 'active';
                    $scope.songs[1].id = '';
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
                                    $scope.songs.shift();

                                    if ($scope.songs.length > 0) {
                                        $scope.currentSong = $scope.songs[0];
                                        audio.load();
                                        window.setTimeout(function () {
                                            audio.play();
                                        }, 1);
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

    $scope.setupSocketFunc = function () {
        document.onNextSong = function () {
            console.log('haLLO');
            $scope.$apply(function () {
                $scope.playlist.shift();
            });
        };
    };

    promise.then(function (data) {
        if (data.length) {
            $scope.songs = data;
            $scope.songs[0].class = 'active';
            $scope.currentSong = $scope.songs[0];
        }
    }, function (reason) {
        console.log(reason);
    });

    document.onEnqueue = function (data) {
        console.log('data', data);
        var start = false;
        if ($scope.songs.length === 0) {
            start = true;
        }
        $scope.songs.push(data);
        if (start) {
            $scope.songs[0].class = 'active';
            $scope.currentSong = $scope.songs[0];
        }
    };

    $scope.next = function () {
        nextSong();
    };

    //init();
}