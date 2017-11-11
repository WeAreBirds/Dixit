'use strict';

module.exports = (config, grunt) => {
    return function () {
        if (grunt.file.exists('dist')) {
            grunt.file.delete('dist');
        } else {
            grunt.log.writeln('No dist folder to clear');
        }
    };
};