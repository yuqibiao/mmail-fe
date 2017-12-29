/**
 * Created by yu
 * on 2017/12/29.
 */
require('./user-login.css');
var _mm= require('util/mm.js');

/*表单错误提示*/
var formError = {
    //显示错误信息
    show:function(errMsg){
      $("#error-item").show().find(".err-msg").text(errMsg);
    },
    //隐藏错误信息
    hidden:function(){
        $("#error-item").hide().find('.err-msg').text('');
    }
};

/*page部分的逻辑*/
var page={
    init:function(){
        this.bindEvent();
    },
    bindEvent:function(){
        var _this = this;
        $("#submit").click(function () {
            _this.submit();
        });
    },
    //表单提交
    submit:function(){
        var formData={
            username:$.trim($("#username").val()),
            password:$.trim($("#password").val()),
        };
        var validateResult = this.formValidate(formData);
        if(validateResult.status){//成功
            formError.hidden();
        }else{//失败
            formError.show(validateResult.msg)
        }

    },
    //验证表单
    formValidate:function(formData){
        var result = {
            status  : false,
            msg     : ''
        };
        if(!_mm.validate(formData.username, 'require')){
            result.msg = '用户名不能为空';
            return result;
        }
        if(!_mm.validate(formData.password, 'require')){
            result.msg = '密码不能为空';
            return result;
        }
        // 通过验证，返回正确提示
        result.status   = true;
        result.msg      = '验证通过';
        return result;
    }

}

$(function () {
page.init();
});