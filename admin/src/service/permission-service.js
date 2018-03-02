/**
 * 权限操作相关的请求
 *
 * Created by yu
 * on 2018/3/2.
 */
var _mm = require("utils/mm.js");

var _permission = {

    /**
     * 根据permissionId得到permission信息
     *
     * @param permissionId
     * @param resolve
     * @param reject
     */
    getPermissionById:function(permissionId , resolve , reject){
        _mm.request({
            url: _mm.getServerUrl("/api/user/v1/permissions/" + permissionId),
            success: resolve,
            error: reject
        });
    },

    /**
     * 修改权限信息
     *
     * @param permissionInfo
     * @param resolve
     * @param reject
     */
    updatePermission:function(permissionInfo , resolve , reject){
        _mm.request({
            type : 'patch',
            url:_mm.getServerUrl("/api/user/v1/permissions"),
            data:permissionInfo,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 根据Id集合批量删除权限
     *
     * @param idList
     * @param resolve
     * @param reject
     */
    deletePermissionByIdList:function(idList , resolve , reject){
        _mm.request({
            type:"post",
            url:_mm.getServerUrl("/api/role/v1/permissions:delete"),
            data :idList,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 根据permissionId删除权限
     *
     * @param permissionId
     * @param resolve
     * @param reject
     */
    deletePermissionById:function (permissionId , resolve , reject) {
        _mm.request({
            type : 'delete',
            url:_mm.getServerUrl("/api/role/v1/permissions/"+permissionId),
            success:resolve,
            error:reject
        });
    },

    /**
     * 添加权限
     *
     * @param permission
     * @param resolve
     * @param reject
     */
    addPermission:function (permission , resolve , reject) {
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/role/v1/permissions"),
            data:permission,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    }

};

module.exports = _permission;
