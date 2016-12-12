export default class GiftsService {
    constructor(AppConstants, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;

        this.current = null;

    }

    getAll() {
        return this._$http.get(
            this._AppConstants.api + 'gifts/list'
        ).then( (res) => res.data );
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
