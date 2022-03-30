const zlib = require("zlib");

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    plugins: [
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg|eot|woff2|woff|ttf)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),
        new CompressionPlugin({
            test: /\.(js|css|html|svg|eot|woff2|woff|ttf)$/,
            filename: "[path][base].gz",
            algorithm: 'gzip',
            minRatio: 0.8
        })
    ]
};