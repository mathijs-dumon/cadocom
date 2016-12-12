import angular from 'angular';

// Create the module where our functionality can attach to
let giftModule = angular.module('app.gift', []);

// Include our UI-Router config settings
import GiftConfig from './gift.config';
giftModule.config(GiftConfig);


// Controllers
import GiftlistCtrl from './gift.controller';
giftModule.controller('GiftlistCtrl', GiftlistCtrl);

import GiftdetailCtrl from './gift.controller';
giftModule.controller('GiftdetailCtrl', GiftdetailCtrl);


export default giftModule;