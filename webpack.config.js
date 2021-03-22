const webpack = require('webpack');
const path = require('path');
const package = require('./package.json');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

// Naming and path settings
const entryPoints = {
  frontend : './src/frontend/main.js',
  admin : './src/admin/main.js'
};
// @NOTE __dirname is coming from node & not from this files location
// set the location where the compiled output will be
const exportPath = path.resolve(__dirname, './assets/js');
// this is where the wordpress website root should be???
const webRoot = '/wp-content';
// set the public access (web) path by removing the base of the absolute export path
// so the lazy component loading can work out where to load the compiled assets in browser
const publicPath = webRoot + exportPath.split(webRoot)[1];

// create an array of plugins being used
const plugins = [];

// add the vue loader plugin
plugins.push(new webpack.ProgressPlugin());

// add the vue loader plugin
plugins.push(new CleanWebpackPlugin());

// add the vue loader plugin
plugins.push(new VueLoaderPlugin());

// add the plugin to extract css into its own file
plugins.push(new MiniCssExtractPlugin({
    filename: '../css/[name].css',
    ignoreOrder: false, // Enable to remove warnings about conflicting order
}));

module.exports = {
    entry: entryPoints,

    // Differ settings based on production flag
    mode: devMode ? 'development' : 'production',

    plugins,

    output: {
        path: exportPath,
        publicPath: `${publicPath}/`,
        // Differ settings based on production flag
        filename: devMode ? '[name].js' : '[name].min.js'
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('./src/'),
            'BIQ': path.resolve('./src/components/BIQ/'),
            'frontend': path.resolve('./src/frontend/'),
            'admin': path.resolve('./src/admin/')
        },

        modules: [
            path.resolve('./node_modules'),
            path.resolve(path.join(__dirname, 'src/'))
        ]
    },

    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\\/]node_modules[\\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },

            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },

            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            mimetype: 'image/png'
                        }
                    }
                ]
            },

            {
                test: /\.svg$/,
                use: 'file-loader'
            },

            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            },
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    'css-loader'
                ],
            }
        ]
    }
}
