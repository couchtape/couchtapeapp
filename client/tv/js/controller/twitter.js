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
