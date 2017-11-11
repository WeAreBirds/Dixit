'use strict';

const path = require('path');
const fs = require('fs-extra');
const _ = require('underscore');

module.exports = (config, grunt, common) => {
    return function() {
        const pathToTemplate = path.join(config.SRC_FOLDER, 'tsconfig.template.json');

        const data = {
            generateDeclarations: !config.args.watch,
            entryFile: `"index.${config.target}.ts"`
        };

        common.templateProcessFile(pathToTemplate, data, config.TSCONFIG_PATH);
    };
};