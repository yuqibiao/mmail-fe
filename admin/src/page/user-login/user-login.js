/**
 * 登录界面相关js
 * Created by yu
 * on 2018/1/8.
 */
require('./user-login.css')
layui.config({
}).use(['form','layer'],function(){
    var form = layui.form();

    //登录按钮事件
    form.on("submit(login)",function(data){

        return false;
    })
})