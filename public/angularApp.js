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
        if (!userid)
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

app.factory('jwtTokenService', [ '$window', function($window) {
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

    o.clearToken = function() {
        $window.localStorage.removeItem('jwtToken');
    };

    return o;

}]);

app.factory('profileService', [ '$rootScope', '$http', 'jwtTokenService', 'API_PREFIX', function($rootScope, $http, jwtTokenService, API_PREFIX) {
    var o = { };

    o.getProfiles = function() {
        return $http.get(API_PREFIX + 'users/list').then(function(res) {
            return res.data;
        });
    };

    o.getProfile = function(id) {
        if (!id)
            id = 'self';
        return $http.get(API_PREFIX + 'users/get/' + id).then(function(res) {
            return res.data;
        });
    };

    o.isAuthed = function() {
        var token = jwtTokenService.getToken();
        if (token) {
            var params = jwtTokenService.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    };

    o.login = function(username, password) {
        return $http.post(API_PREFIX + 'users/login', {
            username: username,
            password: password,
        })
        .success(function(user){
            // No error: authentication OK
            $rootScope.authed = true;
        })
        .error(function(){
            // Error: authentication failed
            jwtTokenService.clearToken();
            $rootScope.authed = false;
        });
    };

    o.logout = function() {
        jwtTokenService.clearToken();
        $rootScope.authed = false;
    };

    o.register = function(username, password) {
        $http.post(API_PREFIX + 'users/register', {
            username: username,
            password: password,
        });
    };

    o.unregister = function() {
        $http.post(API_PREFIX + 'users/unregister');
        o.logout();
    }

    return o;

}]);

/*---------------------------------------------------------------------------------------*/
/*                                    Interceptors                                       */
/*---------------------------------------------------------------------------------------*/
app.factory('authInterceptor', function(API_PREFIX, jwtTokenService) { 
    return { 
        request: function(config) {  // automatically attach auth header
            var token = jwtTokenService.getToken();
            if(config.url.indexOf(API_PREFIX) === 0 && token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        },
        response: function(res) { // if a token was received, save it
            if(res.config.url.indexOf(API_PREFIX) === 0 && res.data.token) {
                jwtTokenService.saveToken(res.data.token);
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
    var requiresAuth = ['$q', '$rootScope', '$location', 'profileService', function($q, $rootScope, $location, profileService) {
        // Initialize a new promise
        var deferred = $q.defer(); 

        if (profileService.isAuthed()) {
            deferred.resolve();
            $rootScope.authed = true;
        } else {
            $location.url('/login');
            deferred.reject();
            $rootScope.authed = false;
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
            profile: ['profileService', function(profileService) {
              return profileService.getProfile();
            }]
        }
    })    
    .state('wishlist', {
        url: '/wishlist/{userId}',
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
                return wishesService.get($stateParams['id']);
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
        url: '/giftdetail/{id}',
        templateUrl: '/views/giftdetail.html',
        controller: 'GiftdetailCtrl',
        resolve: {
            gift: ['$stateParams', 'giftsService', function($stateParams, giftsService) {
              return giftsService.get($stateParams['id']);
            }],
            authPromise: requiresAuth
        } 
    })
    .state('profilelist', {
        url: '/profilelist',
        templateUrl: '/views/profilelist.html',
        controller: 'ProfilelistCtrl',
        resolve: {
            profiles: ['profileService', function(profileService) {
              return profileService.getProfiles();
            }],
            authPromise: requiresAuth,
        }
    })
    .state('profile', {
        url: '/profile/{id}',
        templateUrl: '/views/profile.html',
        controller: 'ProfiledetailCtrl',
        resolve: {
            profile: ['$stateParams', 'profileService', function($stateParams, profileService) {
              var profile = profileService.getProfile($stateParams['id']);
              return profile;
            }],
            authPromise: requiresAuth,
        }
    })
    .state('logout', {
        url: '/logout',
        controller: function($scope, $rootScope, $location, profileService) {
            profileService.logout();
            $rootScope.message = 'Succesfully logged out!';
            $location.url('/login');
        }
    })
    .state('login', {
        url: '/login',
        templateUrl: '/views/login.html',
        controller: 'AuthCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: '/views/register.html',
        controller: 'AuthCtrl'
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
    '$stateParams',
    'wishesService',
    'wishes',
    function($rootScope, $scope, $state, $stateParams, wishesService, wishes) {
        $rootScope.title = 'Wishlist';
        $scope.wishes = wishes;

        if ($stateParams['userId']=='self') {
            $scope.canAddWishes = true;
        }
        else {
            $scope.canAddWishes = false;
        }

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

app.controller('AuthCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    'profileService',
    function($rootScope, $scope, $location, profileService) {
        $rootScope.title = 'Welcome';

        // Redirect if user is authed:
        if (profileService.isAuthed())
            $location.url('/');

        $scope.login = function () {
            profileService
              .login($scope.user.username, $scope.user.password)
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
            profileService
              .register($scope.user.username, $scope.user.password)
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

app.controller('ProfilelistCtrl', [
    '$rootScope',
    '$scope',
    'profiles',
    function($rootScope, $scope, profiles) {
        $rootScope.title = 'User Profiles';
        $scope.profiles = profiles;
    }
]);


app.controller('ProfiledetailCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    'profile',
    function($rootScope, $scope, $state, profile) {
        $rootScope.title = 'User Profile';
        $scope.profile = profile;

        $scope.unregister = function() {
            profileService.unregister();
            $state.reload();
        }
    }
]);
