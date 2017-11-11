'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = config => {
    return function () {
        fs.ensureDirSync(path.join(config.EVERLIVE_CORDOVA_PATH, 'platforms'));
        fs.ensureDirSync(path.join(config.EVERLIVE_CORDOVA_PATH, 'plugins'));
        fs.ensureDirSync(path.join(config.EVERLIVE_CORDOVA_PATH, 'www'));
    }
};