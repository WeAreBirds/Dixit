'use strict';

const _ = require('underscore');

module.exports = (config, grunt) => {
    return {
        sessionId: null,
        env: {
            sessionId: {
                sessionId: function () { //grunt-env with function to set the sessionId env variable
                    return grunt.config.get('sessionId');
                }
            }
        },
        shell: {
            options: {
                failOnError: false
            },
            initializeNativeScriptPlatforms: {
                command: 'tns platform add android',
                options: {
                    execOptions: {
                        cwd: config.EVERLIVE_NATIVESCRIPT_PATH
                    }
                }
            },
            initializeCordovaPlatforms: {
                command: 'cordova platform add android',
                options: {
                    execOptions: {
                        cwd: config.EVERLIVE_CORDOVA_PATH
                    }
                }
            },
            initializeCordovaPlugins: {
                command: 'cordova plugin add https://github.com/apache/cordova-plugin-file.git https://github.com/apache/cordova-plugin-whitelist https://github.com/apache/cordova-plugin-file-transfer.git https://github.com/Telerik-Verified-Plugins/PushNotification https://github.com/litehelpers/Cordova-sqlite-storage.git',
                options: {
                    execOptions: {
                        cwd: config.EVERLIVE_CORDOVA_PATH
                    }
                }
            },
            deployCordovaApp: {
                command: 'cordova run android',
                options: {
                    execOptions: {
                        cwd: config.EVERLIVE_CORDOVA_PATH
                    }
                }
            },
            deployNativeScriptApp: {
                command: 'tns run android --justlaunch',
                options: {
                    execOptions: {
                        cwd: config.EVERLIVE_NATIVESCRIPT_PATH
                    }
                }
            },
            clearLogcat: {
                command: 'adb logcat -c'
            }
        },
        watch: {
            test: {
                files: config.watchFiles,
                tasks: ['test'],
                options: {
                    spawn: false,
                    atBegin: true
                }
            }
        },
        connect: {
            tests: {
                options: {
                    base: './',
                    keepalive: true,
                    useAvailablePort: true
                }
            }
        },
        exorcise: {
            everlive: {
                options: {},
                files: {
                    [`./${config.target}.map`]: [`./${config.target}.js`]
                }
            }
        },
        uglify: {
            dist: {
                options: {
                    preserveComments: require('uglify-save-license')
                },
                files: {
                    [`./dist/${config.target}.all.min.js`]: [`./dist/${config.target}.all.js`]
                }
            }
        },
        copy: {
            license: {
                src: './license',
                dest: './dist/license'
            },
            readme: {
                src: './readme',
                dest: './dist/readme'
            }
        },
        compress: {
            dist: {
                options: {
                    archive: `${_.capitalize(config.target)}SDK.JS.zip`
                },
                cwd: './dist',
                src: ['**'],
                flatten: false,
                expand: true
            }
        }
    };
};