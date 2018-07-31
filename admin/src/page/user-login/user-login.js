/**
 * 登录界面相关js
 * Created by yu
 * on 2018/1/8.
 */
require('./user-login.css')
var _user = require("service/user-service.js");
layui.config({}).use(['form', 'layer'], function () {
    var $ = layui.jquery,
        layer = layui.layer, //获取当前窗口的layer对象
        form = layui.form();

    var imgSrc = $("#validate_code");

    $(function () {
        imgSrc.attr("src", _user.generateValidateCode());
    });

    //登录按钮事件
    form.on("submit(login)", function (data) {
        _user.login(data.field.username, data.field.password,data.field.code,
            function (res) {
                window.location.href = "./index.html";
            /*    if (200 !== res.code){
                    layer.msg('' +res.msg);
                }*/
            }, function (errorMsg) {
                layer.msg('' + errorMsg);
            });
        return false;
    });

    //验证码
    $("#validate_code").click(function () {
        chgUrl( _user.generateValidateCode());
    });

    // 时间戳
    // 为了使每次生成图片不一致，即不让浏览器读缓存，所以需要加上时间戳
    function chgUrl(url) {
        var timestamp = (new Date()).valueOf();
        url = url.substring(0, 20);
        if ((url.indexOf("&") >= 0)) {
            url = url + "×tamp=" + timestamp;
        } else {
            url = url + "?timestamp=" + timestamp;
        }
        return url;
    }

});