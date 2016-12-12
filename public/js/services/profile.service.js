
export default class ProfileService {
    constructor(AppConstants, JwtTokenService, $location, $rootScope, $http, $q) {
        'ngInject';

        this._AppConstants = AppConstants;
        this._JwtTokenService = JwtTokenService;
        this._$q = $q;
        this._$http = $http;
        this._$rootScope = $rootScope;
        this._$location = $location;
    }

    getProfiles() {
        return this._$http.get(
            this._AppConstants.api + 'users/list'
        ).then( (res) => res.data );
    }

    getProfile(id) {
        if (!id)
            id = 'self';
        return this._$http.get(
            this._AppConstants.api + 'users/get/' + id
        ).then( (res) => res.data );
    }

    isAuthed() {
        var token = this.JwtTokenService.getToken();
        if (token) {
            var params = this.JwtTokenService.parseJwt(token);
            return Math.round(new Date().getTime() / 1000) <= params.exp;
        } else {
            return false;
        }
    }

    login(username, password) {
        return this._$http.post(
            this._AppConstants.api + 'users/login', {
                username: username,
                password: password,
            }
        ).success(function(){
            // No error: authentication OK
            this._$rootScope.authed = true;
        })
        .error(function(){
            // Error: authentication failed
            this.JwtTokenService.clearToken();
            this._$rootScope.authed = false;
        });
    }

    logout() {
        this.JwtTokenService.clearToken();
        this._$rootScope.authed = false;
    }

    register(username, password) {
        return this._$http.post(
            this._AppConstants.api + 'users/register', {
                username: username,
                password: password,
            }
        );
    }

    unregister() {
        return this._$http.post(
            this._AppConstants.api + 'users/unregister'
        ).succes(function() {
            this.logout()
        });
    }

    requiresAuth() {
        // Initialize a new promise
        var deferred = this._$q.defer(); 

        if (this.isAuthed()) {
            deferred.resolve();
            this._$rootScope.authed = true;
        } else {
            this._$location.url('/login');
            deferred.reject();
            this._$rootScope.authed = false;
        }

        return deferred.promise;
    };

};