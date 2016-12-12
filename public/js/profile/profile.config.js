function ProfileConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.profilelist', {
            url: '/profilelist',
            templateUrl: 'profilelist.html',
            controller: 'ProfilelistCtrl',
            resolve: {
                profiles: (ProfileService) => ProfileService.getProfiles(),
                authPromise: (ProfileService) => ProfileService.RequiresAuth(),
            }
        })
        .state('app.profile', {
            url: '/profile/{id}',
            templateUrl: 'profile.html',
            controller: 'ProfiledetailCtrl',
            resolve: {
                profile: (ProfileService, $stateParams) => ProfileService.getProfile($stateParams['id']),
                authPromise: (ProfileService) => ProfileService.RequiresAuth(),
            }
        });
}

export default ProfileConfig;