
export default class JwtTokenService {
    constructor(AppConstants, $window) {
        'ngInject';

        this.AppConstants = AppConstants;
        this._$window = $window;

        this.current = null;

    }

    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(this._$window.atob(base64));
    }

    saveToken(token) {
        this._$window.localStorage[this.AppConstants.jwtKey] = token;
    }

    getToken() {
        return this._$window.localStorage[this.AppConstants.jwtKey];
    }

    clearToken() {
        this._$window.localStorage.removeItem(this.AppConstants.jwtKey);
    };
}