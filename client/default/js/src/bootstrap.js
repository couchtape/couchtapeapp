'use strict';

angular.module('couchtapeParty', []).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/current', {
    templateUrl: 'tmpl/current-song.html',
    controller: 'CurrentSongCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/current'});
  $locationProvider.html5Mode(false);
}]);
