import angular from 'angular';

function WishConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.wishlist', {
            url: '/wishlist/{userId}',
            templateUrl: 'wishlist.html',
            controller: 'WishlistCtrl as $ctrl',
            resolve: {
                wishes: (WishesService, $stateParams) => WishesService.getAll($stateParams['userId']),
                profile: (ProfileService, $stateParams) => ProfileService.getProfile($stateParams['userId']),
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'Wishlist'
        })
        .state('app.wishdetail', {
            url: '/wishdetail/{id}',
            templateUrl: 'wishdetail.html',
            controller: 'WishdetailCtrl as $ctrl',
            resolve: {
                wish: (WishesService, $stateParams) => WishesService.getWish($stateParams['id']),
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'Wish details'
        });


}

export default WishConfig;