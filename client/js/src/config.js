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
