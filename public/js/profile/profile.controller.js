export class ProfilelistCtrl {
  constructor($rootScope, $scope, profiles) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;

    this._$rootScope.title = 'User Profiles';
    this._$scope.profiles = profiles;
  }
};

export class ProfiledetailCtrl {
  constructor($rootScope, $scope, $state, ProfileService, profile) {
    'ngInject';

    this._$rootScope = $rootScope;
    this._$scope = $scope;
    this._$state = $state;
    this.ProfileService = ProfileService;

    this._$rootScope.title = 'User Profile';
    this._$scope.profile = profile;
  }

  unregister() {
    ProfileService.unregister();
    this._$state.reload();
  }
};