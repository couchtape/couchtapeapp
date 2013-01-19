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
