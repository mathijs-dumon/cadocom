import angular from 'angular';

let componentsModule = angular.module('app.components', []);

import ShowAuthed from './show-authed.directive';
componentsModule.directive('showAuthed', ShowAuthed);

export default componentsModule;