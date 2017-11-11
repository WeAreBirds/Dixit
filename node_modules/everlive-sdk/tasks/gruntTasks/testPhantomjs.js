'use strict';

const path = require('path');

module.exports = (config, grunt, common) => {
    return function () {
        var done = this.async();
        if (path.extname(config.file) !== '.html') {
            grunt.fail.fatal('The file to run in phantomjs must be of type html ' + config.file);
        }

        common.handleSpawnProcess(path.join(config.ROOT_FOLDER, 'node_modules/phantomjs/bin/phantomjs'), ['./test/external/phantomjsTest.js', config.file],
            null, config.PLATFORMS.Desktop, done);
    };
};