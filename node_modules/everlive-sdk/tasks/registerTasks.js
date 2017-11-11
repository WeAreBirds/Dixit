'use strict';

module.exports = function (config, grunt) {
    const common = require('./gruntTasks/common')(config, grunt);
    const importTask = taskName => grunt.registerTask(taskName, require(`./gruntTasks/${taskName}`)(config, grunt, common));

    importTask('webpackBuild');
    importTask('replaceVersion');
    importTask('loginInIdentity');
    importTask('processExternalConfig');
    importTask('copyEverlive');
    importTask('copyTests');
    importTask('readLogcat');
    importTask('testPhantomjs');
    importTask('createCordovaFolders');
    importTask('processCordovaConfig');
    importTask('createNativeScriptFolders');
    importTask('processNativeScriptConfig');
    importTask('clearTestResults');
    importTask('test');
    importTask('clearDistFolder');
    importTask('nodejsRunTests');
    importTask('renameIndexDeclaration');
    importTask('moveDeclarations');
    importTask('cleanSrcFolderDeclarations');
    importTask('generateTsConfigFile');

    //release build
    grunt.registerTask('default', ['clearDistFolder', 'build', 'copyEverlive', 'uglify:dist', 'copy:license', 'copy:readme', 'compress:dist']);

    grunt.registerTask('build', ['generateTsConfigFile', 'cleanSrcFolderDeclarations', 'webpackBuild', 'moveDeclarations', 'replaceVersion']);

    //common tests task
    grunt.registerTask('testCommon', ['loginInIdentity', 'processExternalConfig', 'build']);

    //desktop
    grunt.registerTask('testDesktop', ['testCommon', 'clearTestResults:Desktop', 'testPhantomjs']);

    //cordova
    grunt.registerTask('initializeCordova', ['createCordovaFolders', 'processCordovaConfig', 'shell:initializeCordovaPlatforms', 'shell:initializeCordovaPlugins']);
    grunt.registerTask('testCordova', ['testCommon', 'clearTestResults:Cordova', 'initializeCordova', 'copyTests:Cordova',
        'shell:deployCordovaApp', 'shell:clearLogcat', 'readLogcat:Cordova']);

    //nativescript
    grunt.registerTask('testNativeScript', ['testCommon', 'clearTestResults:NativeScript', 'createNativeScriptFolders', 'shell:initializeNativeScriptPlatforms',
        'copyTests:NativeScript', 'processNativeScriptConfig', 'shell:deployNativeScriptApp', 'shell:clearLogcat', 'readLogcat:NativeScript']);

    //nodejs
    grunt.registerTask('testNodejs', ['testCommon', 'clearTestResults:Nodejs', 'nodejsRunTests']);
};