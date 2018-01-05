/**
 * Created by yu
 * on 2018/1/4.
 */
require('common/nav-operation/nav-operation.js');
require('common/nav-search/nav-search.js');
require('./goods-detail.css');
var _mm = require('utils/mm.js');
var htmlTemplate = require('./goods-detail.string');

var res={
    "status": 0,
    "data": {
        "id": 31,
        "categoryId": 100012,
        "name": "【测试学习使用】【特卖】魅族 魅蓝E2 4GB+64GB 全网通公开版 香槟金 移动联通电信4G手机 双卡双待",
        "subtitle": "P20芯片！5.5英寸！800+1300W像素！3400mAh大电池！",
        "mainImage": "7d71fc85-1d6a-4613-b9b7-c8956d8a38d5.jpg",
        "subImages": "7d71fc85-1d6a-4613-b9b7-c8956d8a38d5.jpg,8303031b-3f51-44af-b968-36bb05d25693.jpg,0ebdac09-4091-4019-9b88-968dfb2f5c46.jpg,57aaa094-4b4e-4267-8c86-2464d591f99d.jpg",
        "detail": "<p><b>魅族 魅蓝E2 4GB+64GB 全网通公开版 香槟金 移动联通电信4G手机 双卡双待</b><br></p><p><b><img alt=\"e2-4.jpg\" src=\"http://img.happymmall.com/aa82d221-0abe-41e5-9ff5-b6f7253595ff.jpg\" width=\"750\" height=\"834\"><br></b></p><p><b><img alt=\"e2-5.jpg\" src=\"http://img.happymmall.com/64929d16-8949-4f8c-a495-432fe15da47a.jpg\" width=\"750\" height=\"578\"><img alt=\"e2-6.jpg\" src=\"http://img.happymmall.com/0d84df9b-50e9-4017-8fc5-63bd29e850c3.jpg\" width=\"750\" height=\"960\"><img alt=\"e2-7.jpg\" src=\"http://img.happymmall.com/5250093d-4faa-4202-b5a2-92fb8b7ced72.jpg\" width=\"750\" height=\"974\"><br></b><img alt=\"e2-8.jpg\" src=\"http://img.happymmall.com/7950b425-8c85-4e71-830d-df360a283b0e.jpg\" width=\"750\" height=\"1056\"></p>",
        "price": 1499,
        "stock": 190367,
        "status": 1,
        "createTime": "",
        "updateTime": "2018-01-05 02:26:15",
        "imageHost": "http://img.happymmall.com/",
        "parentCategoryId": 100002
    }
};

var page={

    init:function () {
      this.loadData();
      this.bindEvent();
    },
    loadData:function () {
        var $pageWrap = $(".page-wrap");
        this.resolveSubImages(res.data);
        var html = _mm.renderHtml(htmlTemplate , res.data);
        $pageWrap.html(html);
    },

    resolveSubImages:function (data) {
        data.subImages = data.subImages.split(",");
    },

    bindEvent:function () {
        $(".p-img-list").on("mouseover" ,".p-img-item" , function () {
            console.log("====over");
            var imgUrl = $(this).find(".p-img").attr('src');
            $(".main-img").attr("src" , imgUrl);
        });
    },


};

$(function () {
  page.init();
});