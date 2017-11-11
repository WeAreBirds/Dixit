'use strict';

module.exports = (config, grunt) => {
    return function () {
        var tasks;
        const platform = config.platform;

        function getTaskByPlatform(platform) {
            return 'test' + platform;
        }

        if (platform === config.PLATFORMS.All) {
            tasks = Object.keys(config.PLATFORMS)
                .filter(function (platform) {
                    return platform !== 'All' && platform !== 'CordovaAndNativeScript';
                })
                .map(function (platform) {
                    return getTaskByPlatform(platform);
                });
        } else if (platform === config.PLATFORMS.CordovaAndNativeScript) {
            tasks = [getTaskByPlatform('Cordova'), getTaskByPlatform('NativeScript')];
        } else {
            tasks = Object.keys(config.PLATFORMS)
                .filter(function (platformKey) {
                    return config.PLATFORMS[platformKey] === platform;
                })
                .map(function (platformKey) {
                    return getTaskByPlatform(platformKey);
                });
        }

        console.log('Running ' + tasks + ' tasks');
        grunt.task.run(tasks);
    };
};