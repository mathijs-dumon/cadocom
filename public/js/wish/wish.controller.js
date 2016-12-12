
class WishlistCtrl {
    constructor($scope, $state, WishesService, wishes, profile, currentProfile) {
        'ngInject';

        this._$scope = $scope;
        this._$state = $state;
        this.WishesService = WishesService;

        this.wishes = wishes;

        this.currentProfile = currentProfile;

        if (profile._id==currentProfile._id) {
            this.isOwner = true;
            this.username = "Your";
        }
        else {
            this.isOwner = false;
            this.username = profile.local.username;
        }
    }

    addWish() {
        return this.WishesService.create({
            title: this._$scope.wishtitle,
            link: this._$scope.link,
            description: this._$scope.description,
        }).then(() => {
            this._$scope.title = '';
            this._$scope.link = '';
            this._$scope.description = '';

            this._$state.reload();                
        });
    };

    deleteWish(id) {
        return this.WishesService.delete(id).then(() => {
            this._$state.reload();
        });
    };  

    donateWish(id) {
        return this.WishesService.donate(id).then(() => {
            this._$state.reload();
        });
    };

};

class WishdetailCtrl {
  constructor(wish, currentProfile) {
    'ngInject';

    this.wish = wish;
    this.currentProfile = currentProfile;
  }
};

export {
    WishlistCtrl,
    WishdetailCtrl
}