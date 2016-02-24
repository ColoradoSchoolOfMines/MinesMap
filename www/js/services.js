angular.module('minesmap.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.service("YelpService", function ($q, $http, $cordovaGeolocation, $ionicPopup) {
  var self = {
    'page': 1,
    'isLoading': false,
    'hasMore': true,
    'results': [],
    'lat': 51.544440,
    'lon': -0.022974,
    'refresh': function () {
      self.page = 1;
      self.isLoading = false;
      self.hasMore = true;
      self.results = [];
      return self.load();
    },
    'next': function () {
      self.page += 1;
      return self.load();
    },
    'load': function () {
      self.isLoading = true;
      var deferred = $q.defer();

      ionic.Platform.ready(function () {
        $cordovaGeolocation
          .getCurrentPosition({timeout: 10000, enableHighAccuracy: false})
          .then(function (position) {
            self.lat = position.coords.latitude;
            self.lon = position.coords.longitude;

            var params = {
              page: self.page,
              lat: self.lat,
              lon: self.lon
            };

            $http.get('https://codecraftpro.com/api/samples/v1/coffee/', {params: params})
              .success(function (data) {
                console.log(data);

                if (data.businesses.length == 0) {
                  self.hasMore = false;
                } else {
                  angular.forEach(data.businesses, function (business) {
                    self.results.push(business);
                  });
                }

                self.isLoading = false;
                deferred.resolve();
              })
              .error(function (data, status, headers, config) {
                self.isLoading = false;
                deferred.reject(data);
              });

          }, function (err) {
            console.error("Error getting position");
            console.error(err);
            $ionicPopup.alert({
              'title': 'Please switch on geolocation',
              'template': "It seems like you've switched off geolocation for caffeinehit, please switch it on by going to you application settings."
            });
          })
      });

      return deferred.promise;
    }
  };

  // Load the data and then paginate twice
  self.load().then(function () {
    self.next().then(function () {
      self.next();
    })
  });

  return self;
});
