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
  var promise = CouchtapeService.getSongs();

  promise.then(function (data) {
    $scope.songs = data;
  });
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
