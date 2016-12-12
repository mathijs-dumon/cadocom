
function HomeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.index', {
            url: '/',
            controller: 'IndexCtrl',
            templateUrl: 'home.html',
            resolve: {
                authPromise: (ProfileService) => ProfileService.RequiresAuth,
                profile: (ProfileService) => ProfileService.getProfile(),
            }
        });
};

export default HomeConfig;


