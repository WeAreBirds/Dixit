'use strict';

const path = require('path');
const fs = require('fs-extra');

module.exports = (config, grunt, common) => {
    return function() {
        const declarations = common.findDeclarationFiles(true);

        if (grunt.file.exists(config.DECLARATIONS_OUTPUT_FOLDER)) {
            grunt.file.delete(config.DECLARATIONS_OUTPUT_FOLDER);
        }

        const typingsIndex = path.join(config.SRC_FOLDER, `typings`, `index.${config.target}.d.ts`);

        declarations
            .filter(f => !grunt.file.arePathsEquivalent(typingsIndex, f.original))
            .map(f => {
                let relativeFilePath = path.relative(config.SRC_FOLDER, f.original);

                if (relativeFilePath === `index.${config.target}.d.ts`) {
                    relativeFilePath = 'index.d.ts';
                }

                return Object.assign({}, f, {
                    destination: path.join(config.DECLARATIONS_OUTPUT_FOLDER, relativeFilePath)
                });
            })
            .forEach(f => {
                fs.outputFileSync(f.destination, fs.readFileSync(f.original, 'utf8'));
                if (!f.isExternal) {
                    fs.unlinkSync(f.original);
                }
            });

        if (!grunt.file.exists(path.join(config.SRC_FOLDER, 'typings', 'globals', 'json-stable-stringify', 'index.d.ts'))) {

        }

        grunt.log.writeln(`Generated ${declarations.length} declarations.`.cyan);
    };
};