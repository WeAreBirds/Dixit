'use strict';

const path = require('path');
const webpack = require('webpack');
const _ = require('underscore');

module.exports = (config, grunt) => {
    return function() {
        const done = this.async();

        const plugins = [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.BannerPlugin(config.banner),
            new webpack.WatchIgnorePlugin([config.MODULES_FOLDER])
        ];
        const entry = [
            path.join(config.SRC_FOLDER, `index.${config.target}.ts`)
        ];
        const devtool = 'source-map';
        const output = {
            path: config.ROOT_FOLDER,
            filename: `${config.target}.js`,
            library: _.capitalize(config.target),
            libraryTarget: 'umd',
            sourceMapFilename: `${config.target}.map`
        };
        const externals = {
            'application-settings': 'application-settings',
            'local-settings': 'local-settings',
            'file-system': 'file-system',
            'http': 'http',
            'url': 'url',
            'https': 'https',
            'zlib': 'zlib',
            'node-localstorage': 'node-localstorage',
            'nativescript-push-notifications': 'nativescript-push-notifications',
            'platform': 'platform',
            'nativescript-sqlite': 'nativescript-sqlite'
        };
        const module = {
            loaders: [
                {
                    test: /\.ts$/,
                    loader: `awesome-typescript-loader?tsconfig=${path.join(config.SRC_FOLDER, 'tsconfig.json')}`,
                    exclude: 'node_modules'
                },
                {
                    test: /\.json$/,
                    loader: 'json'
                }
            ]
        };
        const resolve = {
            root: [
                config.MODULES_FOLDER
            ],
            extensions: ['', '.ts', '.js', '.json']
        };

        const compiler = webpack({
            entry,
            devtool,
            output,
            externals,
            plugins,
            module,
            resolve,
            bail: true
        });

        if (config.args.watch) {
            let buildId = 0;

            compiler.watch({
                aggregateTimeout: 300,
                poll: true
            }, (err, buildStats) => {
                if (err) {
                    return console.error(JSON.stringify(err));
                }

                const time = `${(buildStats.endTime - buildStats.startTime) / 1000}`.red;
                const build = `#${++buildId}`.red;

                grunt.log.writeln(`
                    ${`Incremental build ${build}`.cyan} ${`took`.cyan} ${time} ${`seconds. ${new Date().toLocaleTimeString()}`.cyan}
                `);
            });
        } else {
            compiler.run(done);
        }
    };
};