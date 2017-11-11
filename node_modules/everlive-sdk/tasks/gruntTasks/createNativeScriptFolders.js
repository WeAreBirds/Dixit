'use strict';

const path = require('path');
const fs = require('fs-extra');

module.exports = config => {
    return function () {
        var platformsPath = path.join(config.EVERLIVE_NATIVESCRIPT_PATH, 'platforms');
        fs.removeSync(platformsPath);
        fs.ensureDirSync(platformsPath)
    };
};