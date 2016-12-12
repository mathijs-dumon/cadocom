class ProfilelistCtrl {
  constructor(profiles, currentProfile) {
    'ngInject';
    
    this.profiles = profiles;
    this.currentProfile = currentProfile;
  }
};

class ProfiledetailCtrl {
  constructor($state, ProfileService, profile, currentProfile) {
    'ngInject';

    this._$state = $state;
    this.ProfileService = ProfileService;

    this.profile = profile;
    this.currentProfile = currentProfile;
  }

  unregister() {
    ProfileService.unregister();
    this._$state.reload();
  }
};

export {
  ProfilelistCtrl,
  ProfiledetailCtrl
}