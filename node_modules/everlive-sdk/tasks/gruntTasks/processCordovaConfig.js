'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('underscore');

module.exports = config => {
    return function () {
        var configFilePath = path.join(config.EVERLIVE_CORDOVA_PATH, 'config.xml');
        var configTemplateFilePath = path.join(config.EVERLIVE_CORDOVA_PATH, 'config.template.xml');
        var configContent = fs.readFileSync(configTemplateFilePath, 'utf8');
        var compiledTemplate = _.template(configContent);
        var configuredConfig = compiledTemplate({file: `"${config.file}"`});

        fs.writeFileSync(configFilePath, configuredConfig);
    };
};