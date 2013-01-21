angular.module('couchtapeParty').controller('CurrentSongCtrl', ['$scope', 'CouchtapeService', 'SocketIO', function ($scope, CouchtapeService, SocketIO) {
  var promise = CouchtapeService.getPlaylist();
  $scope.playlist = [];

  SocketIO.on('enqueue', function (data) {
    $scope.$apply(function () {
      $scope.playlist.push(data);
    });
  });

  SocketIO.on('nextSong', function () {
    // add a timeout to be sure, that $apply works
    window.setTimeout(function () {
      $scope.$apply(function () {
        $scope.playlist.shift();
      });
    });
  });

  $scope.song = CouchtapeService.getCurrentSong();

  promise.then(function (data) {
    $scope.playlist = data;
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

    promise.then(function () {
      alert('Added song to playlist');
    });
  };
}]);

angular.module('couchtapeParty').controller('MenuCtrl', ['$scope', 'SocketIO', function ($scope, SocketIO) {

  $scope.menuOpen = false;

  $scope.toggleMenu = function () {
    $scope.menuOpen = !$scope.menuOpen;
  };

  $scope.nextSong = function () {
    SocketIO.nextSong(true);
  };
}]);
