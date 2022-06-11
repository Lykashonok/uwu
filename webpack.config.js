const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCss = require('mini-css-extract-plugin');
const path = require('path')

module.exports = {
    mode: "development",
    entry: "./src/main.ts",
    output: {
        filename: "./main.js",
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "umd",
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
            "fs": false
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(s*)css$/,
                use: [
                    miniCss.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    devServer: {
        port: 4200,
        static: path.resolve(__dirname, 'dist'),
        compress: true,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            favicon: "./src/favicon.ico"
        }),
        new miniCss({
            filename: 'style.css',
        }),
    ]
};