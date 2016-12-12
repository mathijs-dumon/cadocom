class IndexCtrl {
  constructor(AppConstants, $rootScope, $scope, profile) {
    'ngInject';

    this.appName = AppConstants.appName;
    $rootScope.title = 'Home';
    $scope.profile = profile;

  }


}

export default IndexCtrl;