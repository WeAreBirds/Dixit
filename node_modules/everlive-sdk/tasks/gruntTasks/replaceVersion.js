'use strict';

const path = require('path');

module.exports = (config, grunt, common) => {
    return function () {
        common.templateProcessFile(path.join(config.ROOT_FOLDER, `${config.target}.js`), {
            version: config.package.version,
            commit: config.commit
        });
    }
};