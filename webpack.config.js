const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    devServer: {
        // port: 9000,
        static: {
            // directory: path.join(__dirname, 'assets'),
            directory: "/"
        },
        server: 'https',
        client: {
            logging: 'verbose',
            overlay: false
        },
        devMiddleware: {
            writeToDisk: true,
            stats: {
                errorDetails: true
            }
        },
        compress: true, // enable gzip compression
        historyApiFallback: {
            index: "/index.html"
        }, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        // https: true, // true for self-signed, object for cert authority
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        // static: {
        //     directory: "/",
        // },
    },
    // stats: "detailed",
    // mode: "development",
    entry: './src/front/index.tsx',
    performance: {
        maxAssetSize: 90 * 2 * 512000,
        maxEntrypointSize: 90 * 2 * 512000,
        hints: false
        // hints: "error"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist/front/'),
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/front/templates/index.html' }),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         { from: path.resolve(__dirname, 'assets'), to: "/assets" },
        //     ]
        // })
    ]

};