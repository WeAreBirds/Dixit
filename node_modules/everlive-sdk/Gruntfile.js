'use strict';

const grunt = require('grunt');
const fs = require('fs-extra');
const path = require('path');
const _ = require('underscore');
const _s = require('underscore.string');
const git = require('simple-git')();
const optimist = require('optimist');

const buildGruntConfig = require('./tasks/gruntConfig');
const registerGruntTasks = require('./tasks/registerTasks');

_.templateSettings = {
    interpolate: /\"<%=([\s\S]+?)%>\"/g
};

_.mixin(_s.exports());

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-shell-spawn');
grunt.loadNpmTasks('grunt-env');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-file-append');
grunt.loadNpmTasks('grunt-exorcise');
grunt.loadNpmTasks('grunt-contrib-compress');

//allows for synchronous and asynchronous pre-configuration
//e.g. get the git commit, get the platform, read files etc.
Promise.resolve({
    PLATFORMS: {
        All: 'all',
        Desktop: 'desktop',
        Cordova: 'cordova',
        NativeScript: 'nativescript',
        CordovaAndNativeScript: 'cordovaandnativescript',
        Nodejs: 'nodejs'
    },
    TARGETS: {
        Everlive: 'everlive',
        Sitefinity: 'sitefinity'
    },
    EVERLIVE_CORDOVA_PATH: path.join(__dirname, 'EverliveCordova'),
    EVERLIVE_NATIVESCRIPT_PATH: path.join(__dirname, 'EverliveNativeScript'),
    TEST_RESULTS_FILE_NAME_TEMPLATE: path.join(__dirname, 'test/testResults'),
    ROOT_FOLDER: __dirname,
    DECLARATIONS_FOLDER: path.join(__dirname, 'src', 'typings'),
    DECLARATIONS_OUTPUT_FOLDER: path.join(__dirname, 'dist', 'declarations'),
    TSCONFIG_PATH: path.join(__dirname, 'src', 'tsconfig.json'),
    SRC_FOLDER: path.join(__dirname, 'src'),
    MODULES_FOLDER: path.join(__dirname, 'node_modules'),
    package: {},
    target: 'everlive',
    shouldUseCache: true,
    shouldUglify: true,
    commit: '',
    banner: '',
    watchFiles: 'test/suites/**/*.js',
    file: 'test/suites/everlive-all.html',
    grunt: {},
    args: {tasks: []},
    metrics: {
        startTime: new Date(),
        endTime: null
    }
})
    .then(config => {
        //parse the input parameters, a sample command to run this file:
        //node Gruntfile.js build --target everlive
        config.args = optimist.argv;
        config.args.tasks = config.args._;
        //if no tasks are passed lets run the default task
        if (!Array.isArray(config.args.tasks) || !config.args.tasks.length) {
            config.args.tasks = ['default'];
        }

        return config;
    })
    .then(config => {
        //hack to avoid loading from a Gruntfile
        grunt.task.init = function() {};
        return config;
    })
    .then(config => {
        //disable cache for regular build task
        if (config.args.tasks.indexOf('build') !== -1) {
            config.shouldUseCache = false;
        }

        return config;
    })
    .then(config => {
        //get the target we are building the sdk for
        config.target = (config.args.target || config.target).toLowerCase();
        const isCorrectPlatform = _.chain(config.TARGETS).values().contains(config.target).value();
        if (!isCorrectPlatform) {
            throw `Incorrect target: ${config.target}`;
        }

        return config;
    })
    .then(config => {
        //get the tests suite
        config.suite = config.args.suite;
        if (config.suite) {
            config.file = `test/suites/${config.suite}/${config.suite}.html`;
        }

        return config;
    })
    .then(config => {
        //get the tests file or use a defined one
        config.file = config.args.file || config.file;
        if (!fs.existsSync(config.file)) {
            throw `File - ${config.file} does not exist`;
        }

        return config;
    })
    .then(config => {
        //get the watchFiles grunt option
        let watchFiles = config.args['watch-files'];
        if (watchFiles) {
            watchFiles = watchFiles.split(' ');
            config.watchFiles = watchFiles;
        }

        return config;
    })
    .then(config => {
        //get the platform grunt option
        config.platform = (config.args.platform || config.PLATFORMS.All).toLowerCase();
        return config;
    })
    .then(config => {
        //read the package.json
        config.package = require('./package.json');
        return config;
    })
    .then(config => {
        //read the current commit
        return new Promise((resolve, reject) => {
            git.revparse(['HEAD'], (err, commit) => {
                if (err) {
                    return reject(err);
                }

                config.commit = commit.trim();
                return resolve(config);
            });
        });
    })
    .then(config => {
        //read the license file
        const licenseFile = fs.readFileSync('./license', 'utf8');
        config.banner = `${licenseFile}
Everlive SDK 
    Version: ${config.package.version}
    Commit: ${config.commit}`;
        return config;
    })
    .then(config => {
        //build the final grunt config
        config.grunt = buildGruntConfig(config, grunt);
        return config;
    })
    .then(config => {
        registerGruntTasks(config, grunt);
        return config;
    })
    .then(config => {
        //initializing the grunt config we built above
        grunt.initConfig(config.grunt, grunt);
        return config;
    })
    .then(config => {
        //execution of the respective tasks
        return new Promise(resolve => {
            grunt.tasks(config.args.tasks, config.args, () => {
                //set when the task finished running
                config.metrics.endTime = new Date();
                return resolve(config);
            });
        });
    })
    .then(config => {
        //lets output the time it took to run the task to the console
        const seconds = (config.metrics.endTime.getTime() - config.metrics.startTime.getTime()) / 1000;
        const secondsColored = `${seconds}`.red;
        grunt.log.writeln(`
            ${`Tasks (${config.args.tasks}) execution finished in:`.cyan} ${secondsColored} ${'seconds'.cyan}
        `);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
