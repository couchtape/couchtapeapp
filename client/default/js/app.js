'use strict';

angular.module('couchtapeParty', []);

angular.module('couchtapeParty', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/current', {
    templateUrl: 'tmpl/current-song.html',
    controller: 'CurrentSongCtrl'
  })
  .when('/artists', {
    templateUrl: 'tmpl/artists.html',
    controller: 'ArtistsCtrl'
  })
  .when('/albums', {
    templateUrl: 'tmpl/albums.html',
    controller: 'AlbumsCtrl'
  })
  .when('/songs', {
    templateUrl: 'tmpl/songs.html',
    controller: 'SongsCtrl'
  })
  .otherwise({redirectTo: '/current'});
}]);

angular.module('couchtapeParty').controller('CurrentSongCtrl', ['$scope', 'CouchtapeService', function ($scope, CouchtapeService) {
  $scope.song = CouchtapeService.getCurrentSong();
  $scope.playlist = CouchtapeService.getPlaylist();
}]);

angular.module('couchtapeParty').controller('ArtistsCtrl', ['$scope', 'CouchtapeService', function ($scope, CouchtapeService) {
  $scope.artists = CouchtapeService.getArtists();
}]);

angular.module('couchtapeParty').controller('AlbumsCtrl', ['$scope', 'CouchtapeService', function ($scope, CouchtapeService) {

}]);

angular.module('couchtapeParty').controller('SongsCtrl', ['$scope', 'CouchtapeService', function ($scope, CouchtapeService) {

  $scope.songs = CouchtapeService.getSongs();
}]);


angular.module('couchtapeParty').service('CouchtapeService', ['Playlist', 'Songs', 'Artists', function (Playlist, Songs, Artists) {
  return {
    getCurrentSong: function () {
      return Songs[0];
    },

    getPlaylist: function () {
      return Playlist;
    },

    getArtists: function () {
      return Artists;
    },

    getSongs: function () {
      return Songs;
    }
  };
}]);


angular.module('couchtapeParty').factory('Playlist', ['Songs', function (Songs) {
  return Songs.slice(0, 3);
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
