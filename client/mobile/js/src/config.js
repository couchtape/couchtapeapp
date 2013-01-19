angular.module('couchtapeParty', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/current', {
    templateUrl: 'mobile/tmpl/current-song.html',
    controller: 'CurrentSongCtrl'
  })
  .when('/artists', {
    templateUrl: 'mobile/tmpl/artists.html',
    controller: 'ArtistsCtrl'
  })
  .when('/albums', {
    templateUrl: 'mobile/tmpl/albums.html',
    controller: 'AlbumsCtrl'
  })
  .when('/songs', {
    templateUrl: 'mobile/tmpl/songs.html',
    controller: 'SongsCtrl'
  })
  .otherwise({redirectTo: '/current'});
}]);
