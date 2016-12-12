function AuthConfig($stateProvider, $httpProvider) {
    'ngInject';

    /* Detects JWT tokens and handles them */
    $httpProvider.interceptors.push(function(AppConstants, JwtTokenService) { 
        return { 
            request: (config) => {  // automatically attach auth header
                var token = JwtTokenService.getToken();
                if(config.url.indexOf(AppConstants.api) === 0 && token) {
                    config.headers['x-access-token'] = token;
                }
                return config;
            },
            response: (res) => { // if a token was received, save it
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
            controller: function($rootScope, $state, ProfileService) {
                ProfileService.logout();
                $rootScope.message = 'Succesfully logged out!';
                $state.go("app.login");
            }
        })
        .state('app.login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'AuthCtrl as $ctrl',
            title: 'Login'
        })
        .state('app.register', {
            url: '/register',
            templateUrl: 'register.html',
            controller: 'AuthCtrl as $ctrl',
            title: 'Register'
        });

};

export default AuthConfig;