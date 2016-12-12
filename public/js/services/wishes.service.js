export default class WishesService {
    constructor(AppConstants, $http) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._$http = $http;

        this.current = null;

    }

    getAll(userid) {
        if (!userid)
            userid = 'self';
        return this._$http.get(
            this._AppConstants.api + 'wishes/list'  + userid
        ).then( (res) => res.data );
    }


    getWish(id) {
        return this._$http.get(
            this._AppConstants.api + 'wishes/' + id
        ).then( (res) => res.data );
    }

    create(wish) {
        return this._$http.post(
            this._AppConstants.api + 'wishes/create', wish
        ).success( (data) => true );
    }

    delete(id) {
        return this._$http.get(
            this._AppConstants.api + 'gifts/' + id + "/delete"
        ).then( (res) => res.data );
    }

    donate(id) {
        return this._$http.get(
            this._AppConstants.api + 'gifts/' + id + "/donate"
        ).then( (res) => res.data );
    }
}