class AppHeaderCtrl {
  constructor(AppConstants, ProfileService, $rootScope) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.isAuthed = ProfileService.isAuthed();

    let updateHeader = () => {
        this.isAuthed = ProfileService.isAuthed();
    };
 
    $rootScope.$on('userLoggedIn', updateHeader);
    $rootScope.$on('userLoggedOut', updateHeader);
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