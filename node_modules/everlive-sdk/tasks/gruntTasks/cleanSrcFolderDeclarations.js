'use strict';

const path = require('path');
const fs = require('fs');

module.exports = (config, grunt, common) => {
    return function() {
        common.findDeclarationFiles()
            .forEach(f => fs.unlinkSync(f.original));
    };
};