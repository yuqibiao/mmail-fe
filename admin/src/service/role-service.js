/**
 * 角色操作相关的请求
 *
 * Created by yu
 * on 2018/3/2.
 */
var _mm = require("utils/mm.js");

var _role = {

    /**
     * 更新角色的权限信息
     *
     * @param updateRolePermissionVo
     * @param resolve
     * @param reject
     */
    updateRolePermission:function (updateRolePermissionVo , resolve , reject) {
        _mm.request({
            type : 'patch',
            url: _mm.getServerUrl("/api/v1/roles/permissions:update"),
            data:updateRolePermissionVo,
            contentType : "application/json",
            success: resolve,
            error: reject
        });
    },

    /**
     * 得到某一角色对应的权限
     *
     * @param roleId
     * @param resolve
     * @param reject
     */
    getAllPermissionById:function(roleId , resolve , reject){
        _mm.request({
            url: _mm.getServerUrl("/api/v1/roles/"+roleId+"/permissions"),
            success: resolve,
            error: reject
        });
    },

    getAllRole:function (resolve , reject) {
        _mm.request({
            url: _mm.getServerUrl("/api/role/v1/roles:all"),
            success: resolve,
            error: reject
        });
    },

    /**
     * 根据roleId得到role信息
     *
     * @param roleId
     * @param resolve
     * @param reject
     */
    getRoleById:function(roleId , resolve , reject){
        _mm.request({
            url: _mm.getServerUrl("/api/role/v1/roles/" + roleId),
            success: resolve,
            error: reject
        });
    },

    /**
     * 修改用户信息
     *
     * @param roleInfo
     * @param resolve
     * @param reject
     */
    updateRole:function(roleInfo , resolve , reject){
        _mm.request({
            type : 'patch',
            url:_mm.getServerUrl("/api/role/v1/roles"),
            data:roleInfo,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 根据Id集合批量删除角色
     *
     * @param roleIdList
     * @param resolve
     * @param reject
     */
    deleteRoleByIdList:function(roleIdList , resolve , reject){
        _mm.request({
            type:"post",
            url:_mm.getServerUrl("/api/role/v1/roles:delete"),
            data :roleIdList,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 根据roleId删除角色
     *
     * @param roleId
     * @param resolve
     * @param reject
     */
    deleteRoleById:function (roleId , resolve , reject) {
        _mm.request({
            type : 'delete',
            url:_mm.getServerUrl("/api/role/v1/roles/"+roleId),
            success:resolve,
            error:reject
        });
    },

    /**
     * 添加角色
     *
     * @param role
     * @param resolve
     * @param reject
     */
    addRole:function (role , resolve , reject) {
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/role/v1/roles"),
            data:role,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    }

};

module.exports = _role;
