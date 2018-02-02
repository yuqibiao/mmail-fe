/**
 * 用户菜单相关请求
 *
 * Created by yu
 * on 2018/2/2.
 */

'use strict';

var _mm = require("utils/mm.js");

var _menu={

    /**
     * 根据userId获取菜单信息
     *
     * @param userId
     * @param resolve
     * @param reject
     */
    getMenusByUserId:function (userId , resolve , reject) {
        _mm.request({
            url:_mm.getServerUrl("/api/admin/menu/v1/menus/users/"+userId),
            success:resolve,
            error:reject
        });
    }
};
//----不要忘记这个！！！！！！！！！！！！！！！！！！！！！！！
module.exports = _menu;
