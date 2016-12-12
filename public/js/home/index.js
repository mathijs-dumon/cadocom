import angular from 'angular';

// Create the module where our functionality can attach to
let homeModule = angular.module('app.home', []);

// Include our UI-Router config settings
import HomeConfig from './home.config';
homeModule.config(HomeConfig);


// Controllers
import IndexCtrl from './home.controller';
homeModule.controller('IndexCtrl', IndexCtrl);


export default homeModule;