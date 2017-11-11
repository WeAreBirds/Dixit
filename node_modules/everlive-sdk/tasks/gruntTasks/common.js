'use strict';

const upath = require('upath');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const _ = require('underscore');
const process = require('process');
const childProcess = require('child_process');
const spawn = childProcess.spawn;
const path = require('path');

module.exports = (config, grunt) => {
    return {
        getTestResultsFileName: function (platform) {
            return `${config.TEST_RESULTS_FILE_NAME_TEMPLATE}${platform}.tap`;
        },
        templateProcessFile: function (inputPath, config, outputPath) {
            outputPath = outputPath || inputPath;

            var fileContent = fs.readFileSync(inputPath, 'utf8');
            var compiledTemplate = _.template(fileContent);
            var processedFile = compiledTemplate(config);

            fs.writeFileSync(outputPath, processedFile);
        },
        handleOutput: function (stdout, stderr, filter, logPlatform, done) {
            var self =this;
            var mochaEndRegex = /# fail ([0-9]+)/;
            var delimiter = 'Mocha^^';
            var uniqueLines = {};
            stdout.on('data', function (data) {
                var parsedData = data.toString();
                var hasFailed = parsedData.indexOf('not ok') !== -1;
                var lines = !hasFailed ? parsedData.split(/\r\n|\n|\r/g) : [parsedData];
                lines.forEach(function (line) {

                    var delimiterIndex = line.indexOf(delimiter);
                    var hasDelimiter = delimiterIndex !== -1;

                    if ((hasDelimiter && logPlatform === config.PLATFORMS.Cordova) ||
                        (hasDelimiter && logPlatform === config.PLATFORMS.NativeScript) ||
                        (hasDelimiter && (logPlatform === config.PLATFORMS.Desktop || logPlatform === config.PLATFORMS.Nodejs))) {

                        var startIndex = delimiterIndex + delimiter.length;
                        var endIndex = !hasFailed ? line.lastIndexOf('"') : line.lastIndexOf('\r\n'); //this check is added in order to read successfully error messages
                        if (endIndex === -1) {
                            endIndex = line.length;
                        }
                        var log = line.substring(startIndex, endIndex).trim();
                        if (!uniqueLines[log]) {
                            uniqueLines[log] = true;
                            grunt.log.writeln(log);
                            fs.appendFileSync(self.getTestResultsFileName(logPlatform), log + '\r\n');

                            if (mochaEndRegex.test(log)) {
                                done();
                            }
                        }
                    }
                });
            });

            stderr.on('data', function (data) {
                grunt.log.writeln(data.toString());
            });
        },
        handleSpawnProcess: function (procName, args, filter, logPlatform, done) {
            var childProc = spawn(procName, args);

            this.handleOutput(childProc.stdout, childProc.stderr, filter, logPlatform, done);

            process.on('exit', function () {
                childProc.kill();
            });
        },
        getTestsFromInputFile: function () {
            let entryFileContent = fs.readFileSync(config.file, 'utf8');
            let $ = cheerio.load(entryFileContent);
            let scripts = $('script');
            return scripts[0].attribs['data-js'].split(',').map(function (test) {
                test = test.trim();

                if (config.file === config.DEFAULT_FILE) {
                    test = path.join('test', 'suites', test);
                } else {
                    var testPath = path.join('test', 'suites');
                    test = path.join(testPath, test);
                }

                return upath.normalize(test);
            });
        },
        findDeclarationFiles: function(includeExternalTypings) {
            const isExternalPredicate = f => grunt.file.doesPathContain(path.join('src', 'typings'), f);
            let declarations = grunt.file.expand(path.join(config.SRC_FOLDER, '/**/*.d.ts'));

            if (!includeExternalTypings) {
                declarations = declarations.filter(f => !isExternalPredicate(f));
            }

            return declarations.map(f => {
                return {
                    original: f,
                    isExternal: isExternalPredicate(f)
                };
            });
        }
    };
};