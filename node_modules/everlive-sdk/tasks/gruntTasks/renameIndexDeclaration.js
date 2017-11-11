'use strict';

const path = require('path');
const fs = require('fs-extra');

module.exports = (config, grunt, common) => {
    return function() {
        const indexDeclaration = path.join(config.DECLARATIONS_OUTPUT_FOLDER, `index.${config.target}.d.ts`);

        if (grunt.file.exists(indexDeclaration)) {
            fs.renameSync(indexDeclaration, 'index.d.ts');
        }
    };
};