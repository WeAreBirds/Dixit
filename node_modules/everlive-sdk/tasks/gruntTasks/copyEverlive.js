'use strict';

const path = require('path');

module.exports = (config, grunt) => {
    return function () {
        grunt.file.copy(path.join(config.ROOT_FOLDER, `${config.target}.js`), path.join(config.ROOT_FOLDER, `dist/${config.target}.all.js`));
        grunt.file.copy(path.join(config.ROOT_FOLDER, `${config.target}.map`), path.join(config.ROOT_FOLDER, `dist/${config.target}.all.map`));
    }
};