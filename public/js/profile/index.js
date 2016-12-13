import angular from 'angular';

// Create the module where our functionality can attach to
let profileModule = angular.module('app.profile', []);

// Include our UI-Router config settings
import ProfileConfig from './profile.config';
profileModule.config(ProfileConfig);

// Controllers
import { ProfilelistCtrl, ProfiledetailCtrl } from './profile.controller';
profileModule.controller('ProfilelistCtrl', ProfilelistCtrl);
profileModule.controller('ProfiledetailCtrl', ProfiledetailCtrl);

export default profileModule;