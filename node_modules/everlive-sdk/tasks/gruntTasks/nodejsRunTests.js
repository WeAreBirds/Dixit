'use strict';

module.exports = (config, grunt, common) => {
    return function () {
        var tests = JSON.stringify(common.getTestsFromInputFile());
        var done = this.async();
        common.handleSpawnProcess('node', ['./test/external/nodejsTest.js', tests], null, config.PLATFORMS.Nodejs, done);
    };
};