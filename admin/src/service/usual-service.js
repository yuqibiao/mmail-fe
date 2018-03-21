/**
 * 一些通用的网络请求
 *
 * Created by yu
 * on 2018/3/15.
 */
var _mm = require("utils/mm.js");

var _usual = {

    /**
     * 得到文件上传服务地址
     *
     * @param resolve
     * @param reject
     */
    getUploadServerAddress:function (resolve, reject) {
        _mm.request({
            type : 'get',
            url:_mm.getServerUrl("/api/upload/v1/server/address"),
            success:resolve,
            error:reject
        });
    }

};

module.exports = _usual;


