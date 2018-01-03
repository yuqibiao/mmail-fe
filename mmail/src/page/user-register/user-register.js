/**
 * Created by yu
 * on 2017/12/29.
 */
require('./user-register.css')
var _mm = require('util/mm.js');


/*表单错误提示*/
var formError = {
    //显示错误信息
    show: function (errMsg) {
        $("#error-item").show().find(".err-msg").text(errMsg);
    },
    //隐藏错误信息
    hidden: function () {
        $("#error-item").hide().find('.err-msg').text('');
    }
};


/*page部分的逻辑*/
var page = {

    init: function () {
        var  _this = this;
        _this.bindEvent();
    },

    bindEvent: function () {
        var _this = this;
        $("#submit").click( function () {
            //--提交表单
            _this.submitForm();
        });
    },

    /*表单提交*/
    submitForm: function () {
        var formData = {
            username: $.trim($("#username").val()),
            password: $.trim($("#password").val()),
            rePassword: $.trim($("#re-password").val()),
            tel: $.trim($("#tel").val()),
            email: $.trim($("#email").val()),
            securityQuestion: $.trim($("#security-question").val()),
            securityAnswer: $.trim($("#security-answer").val())
        }
        var validateResult = this.validateForm(formData);
        if (validateResult.status) {//验证通过
            formError.hidden();
        } else {//验证不通过
            formError.show(validateResult.msg);
        }
    },

    /*表单验证*/
    validateForm: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_mm.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空'
            return result;
        }
        if (!_mm.validate(formData.password, 'require')) {
            result.msg = '密码不能为空'
            return result;
        }
        if(formData.password.length<6 || formData.password.length>21){
            result.msg = '密码必须在6~21位之间';
            return result;
        }
        if (formData.password !== formData.rePassword) {
            result.msg = '两次输入的密码不一样'
            return result;
        }
        if (!_mm.validate(formData.tel, 'phone')) {
            result.msg = '请输入正确的手机号'
            return result;
        }
        if (!_mm.validate(formData.email, 'email')) {
            result.msg = '请输入正确的邮箱'
            return result;
        }
        result.msg = '验证通过';
        result.status = true;
        return result;
    }
}

$(function () {
    page.init();
});