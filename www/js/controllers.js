angular.module('minesmap.controllers', [])

.controller('YelpController', function($scope, YelpService, NgMap) {

  NgMap.getMap().then(function(map){
    $scope.map = map;
  })
  
  $scope.yelp = YelpService;

  $scope.doRefresh = function () {
    if (!$scope.yelp.isLoading) {
      $scope.yelp.refresh().then(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  };

  $scope.loadMore = function () {
    console.log("loadMore");
    if (!$scope.yelp.isLoading && $scope.yelp.hasMore) {
      $scope.yelp.next().then(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }
  };

  $scope.getDirections = function (cafe) {
    console.log("Getting directions for cafe");
    var destination = [
      cafe.location.coordinate.latitude,
      cafe.location.coordinate.longitude
    ];

    var source = [
      $scope.yelp.lat,
      $scope.yelp.lon
    ];

    launchnavigator.navigate(destination, source);
  };

  $scope.showCafeDetail = function(event, cafe) {
    $scope.yelp.cafe = cafe;
    $scope.map.showInfoWindow.apply(this, [event, 'marker-info']); //make sure match id of marker-info

  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
