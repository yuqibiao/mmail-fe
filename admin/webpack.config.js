/**
 * webpack配置
 *
 * Created by yu
 * on 2017/12/29.
 */
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, title) {
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + name + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common', name],
    };
};
// webpack config
var config = {
    entry: {
        'common': ['./src/page/common/common.js'],
        'user-login': ['./src/page/user-login/user-login.js'],
    },
    output: {
        path: './dist',
        publicPath: '/dist',
        filename: 'js/[name].js'
    },
    module: {
     /*   noParse: [
            __dirname +'/src/utils/plugin'
        ],*/
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            { test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=100&name=/resource/[name].[ext]' },
            { test: /\.string$/, loader: 'html-loader'}
        ]
    },
    resolve: {
        alias: {
            node_modules: __dirname + '/node_modules',
            utils: __dirname + '/src/utils',
        }
    },
    plugins: [
        // 独立通用模块到js/base.js
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/base.js'
        }),
        // 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        //把指定文件夹下的文件复制到指定的目录
        new CopyWebpackPlugin([
            { from: __dirname+'/src/utils/plugin/layui',to: 'plugin/layui' },

        ]),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('user-login', '用户后台登录')),
    ]
};

module.exports = config;