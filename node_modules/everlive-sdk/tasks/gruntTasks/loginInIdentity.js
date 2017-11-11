'use strict';

const tfis2 = require('../../test/tfis/TFIS2');

module.exports = (config, grunt) => {
    return function () {
        var done = this.async();
        tfis2.login(function (err, sessionId) {
            if (err) {
                return done(err);
            }

            console.log('SessionID: ' + sessionId);
            grunt.config.set('sessionId', sessionId);
            done();
        });
    };
};