/**
 * 用户相关的请求
 *
 * Created by yu
 * on 2018/2/26.
 */

var _mm = require("utils/mm.js");

var _user = {

    /**
     * 生成验证码
     *
     * @param path
     * @returns {*}
     */
    generateValidateCode : function(path){
        return _mm.getServerUrl("/api/validateCode/generate");
    },

    /**
     * 登录
     *
     * @param username
     * @param pwd
     * @param code
     * @param resolve
     * @param reject
     */
    login:function(username , pwd , code , resolve , reject){
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/user/v1/user/login"),
            data:{username:username , pwd:pwd , code:code},
            success:resolve,
            error:reject
        });
    },

    /**
     * 批量删除用户
     *
     * @param userIdList
     * @param resolve
     * @param reject
     */
    deleteUserByIdList:function(userIdList , resolve , reject){
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/user/v1/users:delete"),
            data:userIdList,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 根据用户id删除用户
     *
     * @param userId
     * @param resolve
     * @param reject
     */
    deleteUserById:function (userId , resolve , reject) {
        _mm.request({
            type : 'delete',
            url:_mm.getServerUrl("/api/user/v1/users/"+userId),
            success:resolve,
            error:reject
        });
    },

    /**
     * 修改用户信息
     *
     * @param userInfo
     * @param resolve
     * @param reject
     */
    updateUser:function(userInfo , resolve , reject){
        _mm.request({
            type : 'patch',
            url:_mm.getServerUrl("/api/user/v1/user"),
            data:userInfo,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 得到所有的权限，用户有的checked=true
     *
     * @param userId
     * @param resolve
     * @param reject
     */
    getAllRoleByUserId:function(userId , resolve , reject){
        _mm.request({
            url: _mm.getServerUrl("/api/v1/users/"+userId+"/roles:all"),
            success: resolve,
            error: reject
        });
    },

    /**
     * 通过Id得到用户信息
     *
     * @param userId
     * @param resolve
     * @param reject
     */
    getUserByUserId:function(userId , resolve , reject) {
        _mm.request({
            url: _mm.getServerUrl("/api/user/v1/users/" + userId),
            success: resolve,
            error: reject
        });
    },

    /**
     * 添加用户
     *
     * @param userId
     * @param resolve
     * @param reject
     */
    addUserRoleList:function(userId ,roleIdList ,  resolve , reject){
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/v1/users/"+userId+"/roles:add"),
            data:roleIdList,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 添加用户
     *
     * @param userId
     * @param resolve
     * @param reject
     */
    addUser:function(user , resolve , reject){
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/user/v1/user"),
            data:user,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    }

};

module.exports = _user;