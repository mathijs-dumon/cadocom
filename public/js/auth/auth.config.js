function AuthConfig($stateProvider, $httpProvider) {
    'ngInject';

    /* Detects JWT tokens and handles them */
    $httpProvider.interceptors.push(function(AppConstants, JwtTokenService) { 
        return { 
            request: function(config) {  // automatically attach auth header
                var token = JwtTokenService.getToken();
                if(config.url.indexOf(AppConstants.api) === 0 && token) {
                    config.headers['x-access-token'] = token;
                }
                return config;
            },
            response: function(res) { // if a token was received, save it
                if(res.config.url.indexOf(AppConstants.api) === 0 && res.data.token) {
                    JwtTokenService.saveToken(res.data.token);
                }
                return res;
            },
        }
    });

    $stateProvider
        .state('app.logout', {
            url: '/logout',
            controller: function($rootScope, $location, ProfileService) {
                ProfileService.logout();
                $rootScope.message = 'Succesfully logged out!';
                $location.url('/login');
            }
        })
        .state('app.login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'AuthCtrl'
        })
        .state('app.register', {
            url: '/register',
            templateUrl: 'register.html',
            controller: 'AuthCtrl'
        });

};

export default AuthConfig;