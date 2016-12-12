import angular from 'angular';

// Create the module where our functionality can attach to
let wishModule = angular.module('app.wish', []);

// Include our UI-Router config settings
import WishConfig from './wish.config';
wishModule.config(WishConfig);


// Controllers
import WishlistCtrl from './wish.controller';
wishModule.controller('WishlistCtrl', WishlistCtrl);

import WishdetailCtrl from './wish.controller';
wishModule.controller('WishdetailCtrl', WishdetailCtrl);


export default wishModule;