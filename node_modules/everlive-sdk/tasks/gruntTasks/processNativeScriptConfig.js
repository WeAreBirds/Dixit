'use strict';

const fs = require('fs-extra');
const _ = require('underscore');
const path = require('path');

module.exports = (config, grunt, common) => {
    return function () {
        var tests = common.getTestsFromInputFile();

        var compiledTemplate = _.template('module.exports = {tests: "<%= nativeScriptTests %>"};');
        var nativeScriptConfig = compiledTemplate({nativeScriptTests: JSON.stringify(tests)});

        fs.outputFileSync(path.join(config.EVERLIVE_NATIVESCRIPT_PATH, 'app', 'config.js'), nativeScriptConfig);
    };
};