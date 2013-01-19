angular.module('couchtapeParty').controller('CurrentSongCtrl', ['$scope', 'CouchtapeService', function ($scope, CouchtapeService) {
  var promise = CouchtapeService.getPlaylist();
  var playlist = [];

  $scope.song = CouchtapeService.getCurrentSong();

  promise.then(function (data) {
    $scope.playlist = data;
    console.dir($scope.playlist);
  }, function (reason) {
    console.log(reason);
  });

}]);



angular.module('couchtapeParty').controller('SongsCtrl', ['$scope', 'CouchtapeService', function ($scope, CouchtapeService) {

  var promise = CouchtapeService.getSongs();

  promise.then(function (data) {
    $scope.songs = data;
  }, function (data) {
     $scope.songs = data; 
  });

  $scope.addSong2Playlist = function (id) {
    var promise = CouchtapeService.addSong2Playlist(id);

    promise.then(function (data) {
      alert('Added song to playlist');
    });
  };
}]);

angular.module('couchtapeParty').controller('MenuCtrl', ['$scope', function ($scope) {

  $scope.menuOpen = false;

  $scope.toggleMenu = function () {
    if (!$scope.menuOpen) {
      $scope.menuOpen = true;
    } else {
      $scope.menuOpen = false;
    }
  }
}]);
