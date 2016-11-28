var app = angular.module('cadoCom', [
    'ui.router'
]);

app.factory('gifts', ['$http', function($http){
    var o = {
        gifts: []
    };
    o.getAll = function() {
        return $http.get('/api/gifts/list').success(function(data){
            angular.copy(data, o.gifts);
        });
    };
    o.create = function(gift) {
        return $http.post('/api/gifts/create', gift).success(function(data){
            o.gifts.push(data);
        });
    };
    o.get = function(id) {
        return $http.get('/api/gifts/' + id).then(function(res) {
            return res.data;
        });
    };
    return o;
}]);

app.controller('ListCtrl', [
    '$scope',
    'gifts',
    function($scope, gifts) {
        $scope.gifts = gifts.gifts;

        $scope.addGift = function() {
            if(!$scope.title || $scope.title === '') { return; }

            gifts.create({
                title: $scope.title,
                link: $scope.link,
                description: $scope.description,
            });

            $scope.title = '';
            $scope.link = '';
            $scope.description = '';
        };
    }
]);

app.controller('GiftsCtrl', [
    '$scope',
    'gifts',
    'gift',
    function($scope, gifts, gift) {
        $scope.gift = gift;
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
        controller: 'ListCtrl',
        resolve: {
            giftPromise: ['gifts', function(gifts) {
                return gifts.getAll();
            }]
        }
    })
    .state('gifts', {
        url: '/gifts/{id}',
        templateUrl: '/gifts.html',
        controller: 'GiftsCtrl',
        resolve: {
            gift: ['$stateParams', 'gifts', function($stateParams, gifts) {
              return gifts.get($stateParams.id);
            }]
        } 
    });

    $urlRouterProvider.otherwise('home');
}]);

