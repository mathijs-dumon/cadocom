var app = angular.module('cadoCom', [
    'ui.router'
]);

app.factory('gifts', ['$http', function($http){
  var o = {
    gifts: []
  };
  o.getAll = function() {
    return $http.get('api/gifts/list').success(function(data){
      angular.copy(data, o.gifts);
    });
  };
  return o;
}]);

app.controller('MainCtrl', [
'$scope',
'gifts',
function($scope, gifts) {
    $scope.gifts = posts.gifts;

    $scope.addGift = function(){
        if(!$scope.title || $scope.title === '') { return; }

        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            description: $scope.description,
        });

        $scope.title = '';
        $scope.link = '';
        $scope.description = '';
    };
}]);

app.controller('GiftsCtrl', [
    '$scope',
    '$stateParams',
    'gifts',
    function($scope, $stateParams, gifts) {
        $scope.gift = gifts.gifts[$stateParams.id];
    }
]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/home.html',
        controller: 'MainCtrl'/*,
        resolve: {
            giftPromise: ['gifts', function(gifts) {
                return gifts.getAll();
            }]
        }*/
    })
    .state('gifts', {
        url: '/gifts',
        templateUrl: '/gifts/gifts.html',
        controller: 'GiftsCtrl'
    });

    $urlRouterProvider.otherwise('home');
}]);

