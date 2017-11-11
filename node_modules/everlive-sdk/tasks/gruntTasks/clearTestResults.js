'use strict';

const fs = require('fs-extra');

module.exports = (config, grunt, common) => {
    return function (platform) {
        fs.removeSync(common.getTestResultsFileName(config.PLATFORMS[platform]));
    };
};