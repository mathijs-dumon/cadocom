
class GiftlistCtrl {
  constructor($state, GiftsService, gifts, currentProfile) {
    'ngInject';

    this._$state = $state;
    this.GiftsService = GiftsService;

    this.gifts = gifts;
    this.currentProfile = currentProfile;
  }

    deleteGift(id) {
        this.GiftsService.undonate(id).then(() => {
            this._$state.reload();
        });
    };  

};

class GiftdetailCtrl {
  constructor(gift, currentProfile) {
    'ngInject';

    this.gift = gift;
    this.currentProfile = currentProfile;
  }
};

export {
    GiftlistCtrl,
    GiftdetailCtrl
}