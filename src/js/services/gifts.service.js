export default class GiftsService {
    constructor(AppConstants, ProfileService, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this.ProfileService = ProfileService;
        this._$http = $http;

        this.current = null;

    }

    getAll() {
        return this._$http.get(
            this._AppConstants.api + 'gifts/list'
        ).then( (res) => res.data );
    }

    getAllWithUsername() {
        return this.getAll().then( (gifts) => {
            angular.forEach(gifts, (value, key) => {
                this.ProfileService.getProfile(key.owner).then(
                    (profile) => { value.username = profile.local.username; }
                );
            });
            return gifts;
        });
    }

    getGift(id) {
        return this._$http.get(
            this._AppConstants.api + 'gifts/' + id
        ).then( (res) => res.data );
    }

    undonate(id) {
        return this._$http.get(
            this._AppConstants.api + 'gifts/' + id + "/undonate"
        ).then( (res) => res.data );
    }
}
