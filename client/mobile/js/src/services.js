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
