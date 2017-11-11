'use strict';

const path = require('path');
const fs = require('fs-extra');

module.exports = config => {
    return function (platformName) {
        var testsFolder = path.join(config.ROOT_FOLDER, 'test');
        platformName = platformName.toLowerCase();

        var platformFolderContent;
        if (platformName === config.PLATFORMS.Cordova) {
            platformFolderContent = path.join(config.EVERLIVE_CORDOVA_PATH, 'www');
            fs.removeSync(platformFolderContent);
            fs.mkdirsSync(platformFolderContent);
        } else if (platformName === config.PLATFORMS.NativeScript) {
            platformFolderContent = path.join(config.EVERLIVE_NATIVESCRIPT_PATH, 'app');
        }

        var platformTestsFolder = path.join(platformFolderContent, 'test');

        fs.readdirSync(path.join(config.ROOT_FOLDER, 'test'))
            .forEach(function (fileName) {
                var filePath = path.join(testsFolder, fileName);
                fs.copySync(filePath, path.join(platformTestsFolder, fileName));
            });

        fs.copySync(path.join(config.ROOT_FOLDER, `${config.target}.js`), path.join(platformTestsFolder, `${config.target}.js`));
        fs.copySync(path.join(config.ROOT_FOLDER, `${config.target}.map`), path.join(platformTestsFolder, `${config.target}.map`));
    };
};