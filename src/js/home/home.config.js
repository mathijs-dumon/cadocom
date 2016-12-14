
function HomeConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.index', {
            url: '/',
            controller: 'IndexCtrl  as $ctrl',
            templateUrl: 'home.html',
            resolve: {
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'Home'
        });
};

export default HomeConfig;


