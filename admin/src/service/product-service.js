/**
 * 商品相关的网络请求
 *
 * Created by yu
 * on 2018/3/13.
 */
var _mm = require("utils/mm.js");

var _product = {


    /**
     * 根据商品Id得到商品信息
     *
     * @param idList
     * @param resolve
     * @param reject
     */
    getProductById:function (productId, resolve, reject) {
        _mm.request({
            type: 'get',
            url: _mm.getServerUrl("/api/product/v1/products/"+productId),
            contentType: "application/json",
            success: resolve,
            error: reject
        });
    },

    /**
     * 更新商品信息
     *
     * @param product
     * @param resolve
     * @param reject
     */
    updateProduct:function (product , resolve, reject) {
        _mm.request({
            type: 'patch',
            url: _mm.getServerUrl("/api/product/v1/products"),
            data: product,
            contentType: "application/json",
            success: resolve,
            error: reject
        });
    },

    /**
     * 批量删除商品
     *
     * @param idList
     * @param resolve
     * @param reject
     */
    deleteProductByIdList: function (idList, resolve, reject) {
        _mm.request({
            type: 'post',
            url: _mm.getServerUrl("/api/product/v1/products:delete"),
            data: idList,
            contentType: "application/json",
            success: resolve,
            error: reject
        });
    },

    /**
     * 根据商品Id删除商品
     *
     * @param productId
     * @param resolve
     * @param reject
     */
    deleteProductById: function (productId, resolve, reject) {
        _mm.request({
            type: 'delete',
            url: _mm.getServerUrl("/api/product/v1/products/" + productId),
            success: resolve,
            error: reject
        });
    },

    /**
     * 添加商品
     *
     * @param product
     * @param resolve
     * @param reject
     */
    addProduct: function (product, resolve, reject) {
        _mm.request({
            type: 'post',
            url: _mm.getServerUrl("/api/product/v1/products"),
            data: product,
            contentType: "application/json",
            success: resolve,
            error: reject
        });
    }

};

module.exports = _product;