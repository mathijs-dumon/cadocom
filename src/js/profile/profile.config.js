function ProfileConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.profilelist', {
            url: '/profilelist',
            templateUrl: 'profilelist.html',
            controller: 'ProfilelistCtrl as $ctrl',
            resolve: {
                profiles: (ProfileService) => ProfileService.getProfiles(),
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'User Profiles'
        })
        .state('app.profiledetail', {
            url: '/profile/{id}',
            templateUrl: 'profile.html',
            controller: 'ProfiledetailCtrl as $ctrl',
            resolve: {
                profile: (ProfileService, $stateParams) => ProfileService.getProfile($stateParams['id']),
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'User Profile'
        });
}

export default ProfileConfig;