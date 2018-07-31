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

// 环境变量, dev, (test), online
var WEBPACK_ENV            = process.env.WEBPACK_ENV || 'dev';

// 获取html-webpack-plugin参数的方法
var getHtmlConfig = function (name, title) {
    var strList = name.split("/");
    var fileName = strList[strList.length-1];
    return {
        template: './src/view/' + name + '.html',
        filename: 'view/' + fileName + '.html',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common', fileName],
    };
};
// webpack config
var config = {
    entry: {
        'index': ['./src/page/index/index.js'],
        'common': ['./src/page/common/common.js'],
        'user-login': ['./src/page/user-login/user-login.js'],
        'user-list': ['./src/page/user-list/user-list.js'],
        'role-list': ['./src/page/role-list/role-list.js'],
        'permission-list': ['./src/page/permission-list/permission-list.js'],
        'product-category-list': ['./src/page/product-category-list/product-category-list.js'],
        'product-list': ['./src/page/product-list/product-list.js'],
        'product-add': ['./src/page/product-list/product-add.js'],
    },
    output: {
        path: './dist',
        publicPath  : WEBPACK_ENV === 'online' ? '//s.happymmall.com/mmall_admin_fe/dist/' : '/dist/',
       /* publicPath: '/dist',*/
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
            service: __dirname + '/src/service',
        }
    },
    devServer: {//接口代理
        port: 8088,
      /*  proxy: {
            '/api': {
                target: 'http://localhost:8080/',
                pathRewrite: {'^/api' : '/mmall/api'},
                changeOrigin: true
            }
        }*/
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
            { from: __dirname+'/src/utils/plugin',to: 'plugin' }
        ]),
        // html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index', '后台管理')),
        new HtmlWebpackPlugin(getHtmlConfig('user/user-login', '用户后台登录')),
        new HtmlWebpackPlugin(getHtmlConfig('user/user-list', '用户信息管理')),
        new HtmlWebpackPlugin(getHtmlConfig('user/user-add', '添加用户')),
        new HtmlWebpackPlugin(getHtmlConfig('user/user-edit', '修改用户')),
        new HtmlWebpackPlugin(getHtmlConfig('user/user-add-role', '分配角色')),
        new HtmlWebpackPlugin(getHtmlConfig('role/role-list', '角色信息管理')),
        new HtmlWebpackPlugin(getHtmlConfig('role/role-add', '添加角色')),
        new HtmlWebpackPlugin(getHtmlConfig('role/role-edit', '修改角色')),
        new HtmlWebpackPlugin(getHtmlConfig('role/role-permission-assignment', '权限分配')),
        new HtmlWebpackPlugin(getHtmlConfig('permission/permission-list', '权限信息管理')),
        new HtmlWebpackPlugin(getHtmlConfig('permission/permission-add', '添加权限')),
        new HtmlWebpackPlugin(getHtmlConfig('permission/permission-edit', '修改权限')),
        new HtmlWebpackPlugin(getHtmlConfig('product-category/product-category-list', '商品分类管理')),
        new HtmlWebpackPlugin(getHtmlConfig('product-category/product-category-add', '添加商品分类')),
        new HtmlWebpackPlugin(getHtmlConfig('product-category/product-category-edit', '编辑商品分类')),
        new HtmlWebpackPlugin(getHtmlConfig('product/product-list', '商品信息管理')),
        new HtmlWebpackPlugin(getHtmlConfig('product/product-add', '商品添加')),
        new HtmlWebpackPlugin(getHtmlConfig('product/product-edit', '商品编辑')),
    ]
};

// 开发环境下，使用devServer热加载
if(WEBPACK_ENV === 'dev'){
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088');
}

module.exports = config;