/**
 * 商品分类相关的操作
 *
 * Created by yu
 * on 2018/3/9.
 */
var _mm = require("utils/mm.js");

var _category = {


    /**
     * 根据Id得到分类信息
     *
     * @param categoryId
     * @param resolve
     * @param reject
     */
    getProductCategoryById:function(categoryId , resolve , reject){
        _mm.request({
            url: _mm.getServerUrl("/api/product/v1/categories/"+categoryId),
            success: resolve,
            error: reject
        });
    },

    /**
     * 得到所有的分类
     *
     * @param resolve
     * @param reject
     */
    getAllProductCategory:function(resolve , reject) {
        _mm.request({
            url: _mm.getServerUrl("/api/product/v1/categories:all"),
            success: resolve,
            error: reject
        });
    },

    /**
     * 更新分类信息
     *
     * @param category
     * @param resolve
     * @param reject
     */
    updateProductCategory:function(category , resolve , reject){
        _mm.request({
            type : 'patch',
            url:_mm.getServerUrl("/api/product/v1/categories"),
            data:category,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 批量删除分类
     *
     * @param categoryIdList
     * @param resolve
     * @param reject
     */
    deleteProductCategoryByIdList:function(categoryIdList , resolve , reject){
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/product/v1/categories:delete"),
            data:categoryIdList,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    },

    /**
     * 通过Id删除分类
     *
     * @param categoryId
     * @param resolve
     * @param reject
     */
    deleteProductCategoryById:function(categoryId ,resolve , reject){
        _mm.request({
            type : 'delete',
            url:_mm.getServerUrl("/api/product/v1/categories/"+categoryId),
            success:resolve,
            error:reject
        });
    },

    /**
     * 添加商品分类
     *
     * @param category
     * @param resolve
     * @param reject
     */
    addProductCategory:function(category ,resolve , reject){
        _mm.request({
            type : 'post',
            url:_mm.getServerUrl("/api/product/v1/categories"),
            data:category,
            contentType : "application/json",
            success:resolve,
            error:reject
        });
    }

};

module.exports = _category;

