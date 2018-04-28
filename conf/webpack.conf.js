const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.json$/,
                loaders: [
                    'json-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                enforce: 'pre'
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: [
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'babel-loader'
                ]
            },
            {
                test: /\.vue$/,
                loaders: [
                    'vue-loader'
                ]
            },
            {
                test: /\.html$/,
                loader: 'vue-template-loader',
                exclude: path.join(__dirname, '../', 'src/index.html'),
                options: {
                    transformToRequire: {
                        img: 'src'
                    }
                }
            },
            {
                test: /\.(png|jpg)/,
                loader: 'file-loader',
                options: {
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|mov)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'icon/[name].[ext]?[hash]'
                }
            },
            {
                enforce: 'post',
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'postcss-loader'
                }, {
                    loader: 'sass-loader',
                    options: {
                        includePaths: [
                            'node_modules/susy/sass',
                            'node_modules/breakpoint-sass/stylesheets',
                            'node_modules/normalize-scss/sass'
                        ]
                    }
                }]
            },
            {
                enforce: 'post',
                test: /\.scss$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        FailPlugin,
        new HtmlWebpackPlugin({
            template: conf.path.src('index.html')
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: () => [autoprefixer]
            },
            debug: true
        })
    ],
    devtool: 'source-map',
    output: {
        path: path.join(process.cwd(), conf.paths.tmp),
        publicPath: '/',
        filename: 'index.js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.scss'],
        alias: {
            '@components': path.join(process.cwd(), conf.paths.src, 'components'),
            '@assets': path.join(process.cwd(), conf.paths.src, 'assets'),
            '@store': path.join(process.cwd(), conf.paths.src, 'store'),
            '@utils': path.join(process.cwd(), conf.paths.src, 'utils'),
            '@containers': path.join(process.cwd(), conf.paths.src, 'containers'),
            'sass': path.join(process.cwd(), conf.paths.src, 'sass/resources')
        }
    },
    entry: [
        // 'webpack/hot/dev-server',
        // 'webpack-hot-middleware/client',
        `./${conf.path.src('index')}`
    ]
};
