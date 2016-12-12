
export class WishlistCtrl {
    constructor($rootScope, $scope, $state, $stateParams, WishesService, wishes, profile) {
        'ngInject';

        this._$rootScope = $rootScope;
        this._$scope = $scope;
        this._$location = $location;
        this.WishesService = WishesService;

        this._$rootScope.title = 'Wishlist';
        this._$scope.wishes = wishes;

        if ($stateParams['userId']=='self' || $stateParams['userId']=='' || $stateParams['userId']==profile._id) {
            this._$scope.isOwner = true;
            this._$scope.username = "Your";
        }
        else {
            this._$scope.isOwner = false;
            this._$scope.username = profile.local.username;
        }
    }

    addWish() {
        return this.WishesService.create({
            title: this._$scope.title,
            link: this._$scope.link,
            description: this._$scope.description,
        }).then(function() {
            this._$scope.title = '';
            this._$scope.link = '';
            this._$scope.description = '';

            this._$state.reload();                
        });
    };

    deleteWish(id) {
        return this.WishesService.delete(id).then(function() {
            this._$state.reload();
        });
    };  

    donateWish(id) {
        return this.WishesService.donate(id).then(function() {
            this._$state.reload();
        });
    };

};

export class WishdetailCtrl {
  constructor($rootScope, $scope, wish) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;

    this._$rootScope.title = 'Wish details';
    this._$scope.wish = wish;
  }
};