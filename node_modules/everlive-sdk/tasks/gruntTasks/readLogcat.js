'use strict';

module.exports = (config, grunt, common) => {
    return function (logPlatform) {
        logPlatform = logPlatform.toLowerCase();
        var done = this.async();
        var adbFilter;
        if (logPlatform === config.PLATFORMS.Cordova) {
            adbFilter = /CordovaLog|SystemWebChromeClient/;
        } else if (logPlatform === config.PLATFORMS.NativeScript) {
            adbFilter = /JS|TNS.Native/;
        }

        common.handleSpawnProcess('adb', ['logcat'], adbFilter, logPlatform, done);
    }
};