class AppHeaderCtrl {
  constructor(AppConstants, ProfileService, $rootScope) {
    'ngInject';

    this.appName = AppConstants.appName;
    
  }
}

let AppHeader = {
  controller: 'AppHeaderCtrl as $ctrl',
  templateUrl: 'header.html'
};

export {
    AppHeader,
    AppHeaderCtrl
};