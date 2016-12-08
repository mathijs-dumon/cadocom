var app = angular.module('cadoCom', [
    'ui.router'
]);

/* Constants: */
app.constant('API_PREFIX', '/api/');


/*---------------------------------------------------------------------------------------*/
/*                                 GIFTS API Factory                                     */
/*---------------------------------------------------------------------------------------*/
app.factory('gifts', ['$http', 'API_PREFIX', function($http, API_PREFIX){
    var o = {
        gifts: []
    };
    o.getAll = function() {
        return $http.get(API_PREFIX + 'gifts/list').success(function(data){
            angular.copy(data, o.gifts);
        });
    };
    o.create = function(gift) {
        return $http.post(API_PREFIX + 'gifts/create', gift).success(function(data){
            o.gifts.push(data);
        });
    };
    o.get = function(id) {
        return $http.get(API_PREFIX + 'gifts/' + id).then(function(res) {
            return res.data;
        });
    };
    return o;
}]);

/*---------------------------------------------------------------------------------------*/
/*                                 AUTH API Factory                                      */
/*---------------------------------------------------------------------------------------*/
app.factory('auth', [ '$window', function($window) {
    var o = { };

    o.parseJwt = function(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
    };

    o.saveToken = function(token) {
        $window.localStorage['jwtToken'] = token;
    };

    o.getToken = function() {
        return $window.localStorage['jwtToken'];
    };

    o.isAuthed = function() {
        var token = o.getToken();
        if (token) {
            var params = o.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };

    o.logout = function() {
        $window.localStorage.removeItem('jwtToken');
    };

    return o;

}]);

app.factory('profile', [ '$http', '$location', 'API_PREFIX', function($http, $location, API_PREFIX) {
    var o = { };

    o.getProfile = function() {
        return $http.get(API_PREFIX + 'users/profile').then(function(res) {
            return res.data;
        });
    };

    return o;

}]);

/*---------------------------------------------------------------------------------------*/
/*                                    Interceptors                                       */
/*---------------------------------------------------------------------------------------*/
app.factory('authInterceptor', function(API_PREFIX, auth) { 
    return { 
        request: function(config) {  // automatically attach auth header
            var token = auth.getToken();
            if(config.url.indexOf(API_PREFIX) === 0 && token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        },
        response: function(res) { // if a token was received, save it
            if(res.config.url.indexOf(API_PREFIX) === 0 && res.data.token) {
                auth.saveToken(res.data.token);
            }
            return res;
        },
    };
});

app.factory('error401Interceptor', function($q, $location) { 
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
});

/*---------------------------------------------------------------------------------------*/
/*                                     AppConfig                                         */
/*---------------------------------------------------------------------------------------*/
app.config([ '$stateProvider', '$urlRouterProvider', '$httpProvider',
function($stateProvider, $urlRouterProvider, $httpProvider) {

    /* Detects 401 errors and redirects to login page: */
    $httpProvider.interceptors.push('error401Interceptor');

    /* Detects JWT tokens and handles them */
    $httpProvider.interceptors.push('authInterceptor');

    /* */
    var requiresAuth = ['$q', '$location', 'auth', function($q, $location, auth) {
        // Initialize a new promise
        var deferred = $q.defer(); 

        if (auth.isAuthed()) {
            deferred.resolve();
        } else {
            $location.url('/login');
            deferred.reject();
        }

        return deferred.promise;
    }];

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/home.html',
        controller: 'ListCtrl',
        resolve: {
            authPromise: requiresAuth,
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
            authPromise: requiresAuth,
            gift: ['$stateParams', 'gifts', function($stateParams, gifts) {
              return gifts.get($stateParams.id);
            }]
        } 
    })
    .state('profile', {
        url: '/profile',
        templateUrl: '/views/profile.html',
        controller: 'UserCtrl',
        resolve: {
            authPromise: requiresAuth,
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'UserCtrl'
    });

    $urlRouterProvider.otherwise('home');


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

app.controller('UserCtrl', [
    '$scope',
    '$window',
    '$rootScope',
    '$http',
    '$location',
    'auth',
    'profile',
    'API_PREFIX',
    function($scope, $window, $rootScope, $http, $location, auth, profile, API_PREFIX) {
        // Redirect if user is authed:
        if (auth.isAuthed())
            $scope.user = profile.getProfile();
        else // not logged in, so should display the login form
            $scope.user = {};

        // Register the login() function
        $scope.login = function () {
            $http.post(API_PREFIX + 'users/login', {
                username: $scope.user.username,
                password: $scope.user.password,
            })
            .success(function(user){
                // No error: authentication OK
                $rootScope.message = 'Authentication successful!';
                $location.url('/');
            })
            .error(function(){
                // Error: authentication failed
                $rootScope.message = 'Authentication failed.';
                $location.url('/login');
            });
        };

        $scope.linkWithFacebook = function() {
            $window.location = "http://localhost:8080" + API_PREFIX + "users/connect/facebook?token=" + auth.getToken();
        };

    }
]);