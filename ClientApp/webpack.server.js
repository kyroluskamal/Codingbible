const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        // This is our Express server for Dynamic universal
        server: './server.ts'
    },
    externals: {
        './dist/server/main': 'require("./server/main")'
    },
    target: 'node',
    resolve: { extensions: ['.ts', '.js'] },
    optimization: {
        minimize: false
    },
    node: {
        __dirname: false
    },
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        noParse: /polyfills-.*\.js/,
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
            {
                // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                // Removing this will cause deprecation warnings to appear.
                test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
                parser: { system: true },
            },
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            // fixes WARNING Critical dependency: the request of a dependency is an expression
            /(.+)?angular(\\|\/)core(.+)?/,
            path.join(__dirname, 'src'), // location of your src
            {} // a map of your routes
        ),
        new webpack.ContextReplacementPlugin(
            // fixes WARNING Critical dependency: the request of a dependency is an expression
            /(.+)?express(\\|\/)(.+)?/,
            path.join(__dirname, 'src'),
            {}
        ),
        new CopyWebpackPlugin([
            'web.config'
        ])
    ]
};