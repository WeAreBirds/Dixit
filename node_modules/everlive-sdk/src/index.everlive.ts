/// <reference path="typings/custom.d.ts" />

import { polyfill } from 'es6-promise';
polyfill();

import './common/index'; //initialize common sdk
import { Everlive } from './everlive/index';

//we want to have both the es6 export syntax and commonjs module.exports
//the es6 export is used in the typings, this allows you to use import KendoSdk from 'everlive-sdk'
//while the commonjs var KendoSdk = require('everlive-sdk') still works
export default Everlive;

module.exports = Everlive;
module.exports.default = Everlive;
