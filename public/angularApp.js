var app = angular.module('cadoCom', [
    'ui.router'
]);

/*---------------------------------------------------------------------------------------*/
/*                                     AppConfig                                         */
/*---------------------------------------------------------------------------------------*/
app.config([
'$stateProvider',
'$urlRouterProvider',
'$httpProvider',
function($stateProvider, $urlRouterProvider, $httpProvider) {

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        // Initialize a new promise
        var deferred = $q.defer(); 

        // Check if the user is logged in
        $http.get('/loggedin').success(function (user) {
            // Authenticated 
            if (user !== '0') 
                deferred.resolve(); 
            // Not Authenticated 
            else {
                $rootScope.message = 'You need to log in.';
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };  

    /* Detects 401 errors and redirects to login page: */
    $httpProvider.interceptors.push(
        function($q, $location) { 
            return { 
                response: function(response) { 
                    // do something on success
                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401)
                        $location.url('/login');
                    return $q.reject(response);
                }
            };
        }
    );

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/home.html',
        controller: 'ListCtrl',
        resolve: {
            giftPromise: ['gifts', function(gifts) {
                return gifts.getAll();
            }],
            loggedin: checkLoggedin
        }
    })
    .state('gifts', {
        url: '/gifts/{id}',
        templateUrl: '/gifts.html',
        controller: 'GiftsCtrl',
        resolve: {
            gift: ['$stateParams', 'gifts', function($stateParams, gifts) {
              return gifts.get($stateParams.id);
            }],
            loggedin: checkLoggedin
        } 
    })
    .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'LoginCtrl'
    });

    $urlRouterProvider.otherwise('home');


}]);

/*---------------------------------------------------------------------------------------*/
/*                                REST API Factories                                     */
/*---------------------------------------------------------------------------------------*/
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

/*---------------------------------------------------------------------------------------*/
/*                                    Controllers                                        */
/*---------------------------------------------------------------------------------------*/
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

app.controller('LoginCtrl', [
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    function($scope, $rootScope, $http, $location) {
        // This object will be filled by the form
        $scope.user = {};

        // Register the login() function
        $scope.login = function () {
            $http.post('/login', {
                username: $scope.user.username,
                password: $scope.user.password,
            })
            .success(function(user){
                // No error: authentication OK
                $rootScope.message = 'Authentication successful!';
                $location.url('/admin');
            })
            .error(function(){
                // Error: authentication failed
                $rootScope.message = 'Authentication failed.';
                $location.url('/login');
            });
        };
    }
]);