'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('underscore');

module.exports = (config, grunt) => {
    return function () {
        var externalConfigFolder = path.join(config.ROOT_FOLDER, 'test', 'suites');
        var externalConfigTemplate = fs.readFileSync(path.join(externalConfigFolder, 'externalconfig.template.js'), 'utf8');
        var compiledTemplate = _.template(externalConfigTemplate);

        var detectPlatformCode = fs.readFileSync(path.join(config.ROOT_FOLDER, 'test', 'everlive.platform.js'), 'utf8');
        var detectPlatformCompiledFunction = new Function(detectPlatformCode);

        var externalConfig = compiledTemplate({
            sessionId: grunt.config.get('sessionId'),
            detectPlatform: detectPlatformCompiledFunction.toString()
        });

        fs.writeFileSync(path.join(externalConfigFolder, 'externalconfig.js'), externalConfig);
    };
};