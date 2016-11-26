var app = angular.module('cadoCom', [
    'ui.router',
    'gifts',
]);

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

require('./gifts/gifts.factory.js');
require('./gifts/gifts.controller.js');

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
            giftPromise: ['gifts', function(gifts) {
                return gifts.getAll();
            }]
        }
    })
    .state('gifts', {
        url: '/gifts/{id}',
        templateUrl: '/gifts.html',
        controller: 'GiftsCtrl'
    });

  $urlRouterProvider.otherwise('home');
}
]);

