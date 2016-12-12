import angular from 'angular';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);


import GiftsService from './gifts.service';
servicesModule.service('GiftsService', GiftsService);

import WishesService from './wishes.service';
servicesModule.service('WishesService', WishesService);

import JwtTokenService from './jwtToken.service';
servicesModule.service('JwtTokenService', JwtTokenService);

import ProfileService from './profile.service';
servicesModule.service('ProfileService', ProfileService);

export default servicesModule;