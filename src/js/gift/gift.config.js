
function GiftConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('app.giftlist', {
            url: '/giftlist',
            templateUrl: 'giftlist.html',
            controller: 'GiftlistCtrl as $ctrl',
            resolve: {
                gifts: (GiftsService) => GiftsService.getAllWithUsername(),
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'Giftlist'
        })
        .state('app.giftdetail', {
            url: '/giftdetail/{id}',
            templateUrl: 'giftdetail.html',
            controller: 'GiftdetailCtrl as $ctrl',
            resolve: {
                gift: (GiftsService, $stateParams) => GiftsService.getGift($stateParams['id']),
                currentProfile: (ProfileService) => ProfileService.requiresAuth(),
            },
            title: 'Gift details'
        });
}

export default GiftConfig;