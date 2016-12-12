
function GiftConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.giftlist', {
            url: '/giftlist',
            templateUrl: 'giftlist.html',
            controller: 'GiftlistCtrl',
            resolve: {
                gifts: (GiftsService, ProfileService) => {
                    GiftsService.getAll().then( (gifts) => {
                        angular.forEach(gifts, (value, key) => {
                            ProfileService.getProfile(key.owner).then(
                                (profile) => { value.username = profile.local.username; }
                            );
                        })
                        return gifts;
                    });
                },
                authPromise: (ProfileService) => ProfileService.RequiresAuth(),
            }
        })
        .state('app.giftdetail', {
            url: '/giftdetail/{id}',
            templateUrl: 'giftdetail.html',
            controller: 'GiftdetailCtrl',
            resolve: {
                gift: (GiftsService, $stateParams) => GiftsService.getGift($stateParams['id']),
                authPromise: (ProfileService) => ProfileService.RequiresAuth(),
            } 
        });
}

export default GiftConfig;