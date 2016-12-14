
export default class ProfileService {
    constructor(AppConstants, JwtTokenService, $location, $rootScope, $http, $q) {
        'ngInject';

        this.AppConstants = AppConstants;
        this.JwtTokenService = JwtTokenService;
        this._$q = $q;
        this._$http = $http;
        this._$rootScope = $rootScope;
        this._$location = $location;
    }

    getProfiles() {
        return this._$http.get(
            this.AppConstants.api + 'users/list'
        ).then( (res) => res.data );
    }

    getProfile(id) {
        if (!id)
            id = 'self';
        return this._$http.get(
            this.AppConstants.api + 'users/get/' + id
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
            this.AppConstants.api + 'users/login', {
                username: username,
                password: password,
            }
        ).then( () => {
            this._$rootScope.$broadcast('userLoggedIn');
        }, () => {
            // Error: authentication failed
            this.JwtTokenService.clearToken();
        });
    }

    logout() {
        this.JwtTokenService.clearToken();
        this._$rootScope.$broadcast('userLoggedOut');
    }

    register(username, password) {
        return this._$http.post(
            this.AppConstants.api + 'users/register', {
                username: username,
                password: password,
            }
        ).then( () => {
            this._$rootScope.$broadcast('userLoggedIn');
        });
    }

    unregister() {
        return this._$http.post(
            this._AppConstants.api + 'users/unregister'
        ).then(() => {
            this.logout()
        });
    }

    requiresAuth() {
        // Initialize a new promise
        var deferred = this._$q.defer(); 

        if (this.isAuthed()) {
            deferred.resolve(this.getProfile());
        } else {
            this._$location.url('/login');
            deferred.reject();
        }

        return deferred.promise;
    }

    requiresProfile() {
        // Initialize a new promise
        var deferred = this._$q.defer(); 

        if (this.isAuthed()) {
            deferred.resolve(this.getProfile());
        } else {
            deferred.resolve(undefined);
        }

        return deferred.promise;
    }

};