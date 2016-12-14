function AppConfig($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {
    'ngInject';

    //$locationProvider.html5Mode(true);

    $stateProvider
        .state('app', {
            abstract: true,
            templateUrl: 'app-view.html'
        });

    $urlRouterProvider.otherwise('/login');

    /* Detects 401 errors and redirects to login page: */
    $httpProvider.interceptors.push(function($q, $location) { 
        return { 
            response: (response) => response,
            responseError: (response) => {
                if (response.status === 401)
                    $location.url('/login');
                return $q.reject(response);
            }
        };
    });
}

export default AppConfig;