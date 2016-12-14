import angular from 'angular';

// Create the module where our functionality can attach to
let layoutModule = angular.module('app.layout', []);

// Components
import { AppHeader, AppHeaderCtrl } from './header.component';
layoutModule.controller('AppHeaderCtrl', AppHeaderCtrl);
layoutModule.component('appHeader', AppHeader);

export default layoutModule;