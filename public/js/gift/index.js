import angular from 'angular';

// Create the module where our functionality can attach to
let giftModule = angular.module('app.gift', []);

// Include our UI-Router config settings
import GiftConfig from './gift.config';
giftModule.config(GiftConfig);


// Controllers
import { GiftlistCtrl, GiftdetailCtrl } from './gift.controller';
giftModule.controller('GiftlistCtrl', GiftlistCtrl);
giftModule.controller('GiftdetailCtrl', GiftdetailCtrl);


export default giftModule;