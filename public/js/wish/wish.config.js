import angular from 'angular';

function WishConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.wishlist', {
            url: '/wishlist/{userId}',
            templateUrl: 'wishlist.html',
            controller: 'WishlistCtrl',
            resolve: {
                wishes: (WishesService, $stateParams) => WishesService.getAll($stateParams['userId']),
                profile: (ProfileService, $stateParams) => ProfileService.getProfile($stateParams['id']),
                authPromise: (ProfileService) => ProfileService.RequiresAuth(),
            }
        })
        .state('app.wishdetail', {
            url: '/wishdetail/{id}',
            templateUrl: 'wishdetail.html',
            controller: 'WishdetailCtrl',
            resolve: {
                wish: (WishesService, $stateParams) => WishesService.get($stateParams['id']),
                authPromise: (ProfileService) => ProfileService.RequiresAuth(),
            } 
        });


}

export default WishConfig;