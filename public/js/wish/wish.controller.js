
export class GiftlistCtrl {
  constructor($rootScope, $scope, $state, GiftsService, gifts) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$location = $location;
    this.GiftsService = GiftsService;

    this._$rootScope.title = 'Giftlist';
    this._$scope.gifts = gifts;
  }

    deleteGift(id) {
        this.GiftsService.undonate(id).then(function() {
            this._$state.reload();
        });
    };  

};

export class GiftdetailCtrl {
  constructor($rootScope, $scope, gift) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;

    this._$rootScope.title = 'Gift details';
    this._$scope.gift = gift;
  }
};