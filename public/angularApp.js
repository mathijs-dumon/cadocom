var app = angular.module('cadoCom', [
    'ui.router'
]);
app.run(['$rootScope', function($rootScope) { 
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    });

    $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeError - fired when an error occurs during transition.');
      console.log(arguments);
    });

    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
    });

    $rootScope.$on('$viewContentLoaded',function(event){
      console.log('$viewContentLoaded - fired after dom rendered',event);
    });

    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
      console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
      console.log(unfoundState, fromState, fromParams);
    });
}]);

/* Constants: */
app.constant('API_PREFIX', '/api/');


/*---------------------------------------------------------------------------------------*/
/*                                 GIFTS API Factory                                     */
/*---------------------------------------------------------------------------------------*/
app.factory('giftsService', ['$http', 'API_PREFIX', function($http, API_PREFIX){
    var o = {};
    o.getAll = function() {
        return $http.get(API_PREFIX + 'gifts/list').then(function(res){
             return res.data;
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
/*                                 WISHES API Factory                                    */
/*---------------------------------------------------------------------------------------*/
app.factory('wishesService', ['$http', 'API_PREFIX', function($http, API_PREFIX){
    var o = {};
    o.create = function(wish) {
        return $http.post(API_PREFIX + 'wishes/create', wish).success(function(data){
            return true;
        });
    };
    o.delete = function(id) {
        return $http.get(API_PREFIX + 'wishes/' + id + '/delete').then(function(res){
            return true;
        });
    };
    o.getAll = function(userid) {
        if (userid == undefined)
            userid = 'self';
        return $http.get(API_PREFIX + 'wishes/list/' + userid).then(function(res){
            return res.data;
        });
    };
    o.get = function(id) {
        return $http.get(API_PREFIX + 'wishes/' + id).then(function(res) {
            return res.data;
        });
    };
    o.donate = function(id) {
        return $http.get(API_PREFIX + 'wishes/' + id + "/donate").then(function(res) {
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
    .state('index', {
        url: '/',
        templateUrl: '/views/home.html',
        controller: 'IndexCtrl',
        resolve: {
            authPromise: requiresAuth,
            profile: ['profile', function(profile) {
              return profile.getProfile();
            }]
        }
    })    
    .state('wishlist', {
        url: '/wishlist',
        params: {
            userId: null
        },
        templateUrl: '/views/wishlist.html',
        controller: 'WishlistCtrl',
        resolve: {
            wishes: ['wishesService', '$stateParams', function(wishesService, $stateParams) {
                return wishesService.getAll($stateParams['userId']);
            }],
            authPromise: requiresAuth
        }
    })
    .state('wishdetail', {
        url: '/wishdetail/{id}',
        templateUrl: '/views/wishdetail.html',
        controller: 'WishdetailCtrl',
        resolve: {
            wish: ['wishesService', '$stateParams', function(wishesService, $stateParams) {
                return wishesService.get($stateParams['id']);;
            }],
            authPromise: requiresAuth
        } 
    })
    .state('giftlist', {
        url: '/giftlist',
        templateUrl: '/views/giftlist.html',
        controller: 'GiftlistCtrl',
        resolve: {
            gifts: ['giftsService', function(giftsService) {
                return giftsService.getAll();
            }],
            authPromise: requiresAuth
        }
    })
    .state('giftdetail', {
        url: '/gifts/{id}',
        templateUrl: '/views/giftdetail.html',
        controller: 'GiftdetailCtrl',
        resolve: {
            gift: ['$stateParams', 'giftsService', function($stateParams, giftsService) {
              return giftsService.get($stateParams['id']);
            }],
            authPromise: requiresAuth
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
    .state('logout', {
        url: '/logout',
        controller: function($scope, $rootScope, $location, auth) {
            auth.logout();
            $rootScope.message = 'Succesfully logged out!';
            $location.url('/login');
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'UserCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: '/views/register.html',
        controller: 'UserCtrl'
    });;

    $urlRouterProvider.otherwise('login');


}]);


/*---------------------------------------------------------------------------------------*/
/*                                    Controllers                                        */
/*---------------------------------------------------------------------------------------*/

app.controller('IndexCtrl', [
    '$rootScope',
    '$scope',
    function($rootScope, $scope, profile) {
        $rootScope.title = 'Home';
        $scope.profile = profile;
    }
]);

app.controller('WishlistCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    'wishesService',
    'wishes',
    function($rootScope, $scope, $state, wishesService, wishes) {
        $rootScope.title = 'Wishlist';
        $scope.wishes = wishes;

        $scope.addWish = function() {
            wishesService.create({
                title: $scope.title,
                link: $scope.link,
                description: $scope.description,
            }).then(function() {
                $scope.title = '';
                $scope.link = '';
                $scope.description = '';

                $state.reload();                
            });
        };

        $scope.deleteWish = function(id) {
            wishesService.delete(id).then(function() {
                $state.reload();
            });
        };
    }
]);

app.controller('WishdetailCtrl', [
    '$rootScope',
    '$scope',
    'wishesService',
    'wish',
    function($rootScope, $scope, wishesService, wish) {
        $rootScope.title = 'Wish details';
        console.log("I'm here with" + wish);
        $scope.wish = wish;
    }
]);

app.controller('GiftlistCtrl', [
    '$rootScope',
    '$scope',
    'giftsService',
    'gifts',
    function($rootScope, $scope, giftsService, gifts) {
        $rootScope.title = 'Giftlist';
        $scope.gifts = gifts;
    }
]);

app.controller('GiftsCtrl', [
    '$rootScope',
    '$scope',
    'giftsService',
    'gift',
    function($rootScope, $scope, giftsService, gift) {
        $rootScope.title = 'Gift details';
        $scope.gift = gift;
    }
]);

app.controller('UserCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    'auth',
    'profile',
    'API_PREFIX',
    function($rootScope, $scope, $http, $location, auth, profile, API_PREFIX) {
        // Redirect if user is authed:
        if (auth.isAuthed()) {
            $scope.user = profile.getProfile();
            $location.url('/');
        }
        else // not logged in, so should display the login form
            $scope.user = {};

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
                $rootScope.message = 'Incorrect username or password!';
                $location.url('/login');
            });
        };

        $scope.register = function () {
            $http.post(API_PREFIX + 'users/register', {
                username: $scope.user.username,
                password: $scope.user.password,
            })
            .success(function(user){
                // No error: authentication OK
                $rootScope.message = 'Registration successful!';
                $location.url('/');
            })
            .error(function(){
                // Error: authentication failed
                $rootScope.message = 'Registration failed!';
                $location.url('/register');
            });
        };

    }
]);