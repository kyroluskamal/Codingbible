const BrotliPlugin = require('brotli-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    plugins: [
        new BrotliPlugin({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg|eot|woff2|woff|ttf)$/,
            minRatio: 0.8
        }),
        new CompressionPlugin({
            test: /\.(js|css|html|svg|eot|woff2|woff|ttf)$/,
            filename: "[path][base].gz",
            algorithm: 'gzip',
            minRatio: 0.8
        })
    ]
};