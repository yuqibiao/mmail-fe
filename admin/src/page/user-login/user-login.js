/**
 * 登录界面相关js
 * Created by yu
 * on 2018/1/8.
 */

require('./user-login.css');
var layui_form = require('node_modules/layui-src/dist/lay/modules/form.js');

layui.config({
    base: layui_form
}).use('form', function () {
    var form = layui.form;
    //监听提交
    form.on('submit(login)', function (data) {
        layer.msg(JSON.stringify(data.field));
        return false;
    });
});