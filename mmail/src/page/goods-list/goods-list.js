/**
 * Created by yu
 * on 2018/1/4.
 */

require('common/nav-operation/nav-operation.js');
require('common/nav-search/nav-search.js');
require('./goods-list.css');
var _mm= require('utils/mm.js');
var templateIndex   = require('./goods-item.string');

var res = {
    "status": 0,
    "data": {
        "pageNum": 1,
        "pageSize": 10,
        "size": 10,
        "orderBy": null,
        "startRow": 1,
        "endRow": 10,
        "total": 19,
        "pages": 2,
        "list": [
            {
                "id": 26,
                "categoryId": 100012,
                "name": "【测试学习使用】Apple iPhone 7 Plus (A1661) 128G手机",
                "subtitle": "iPhone 7，现更以lv色呈现。",
                "mainImage": "241997c4-9e62-4824-b7f0-7425c3c28917.jpeg",
                "price": 6997,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 27,
                "categoryId": 100006,
                "name": "【测试学习使用】Midea/美的 BCD-535WKZM(E)冰箱双开门无霜智能家用厨卫家电",
                "subtitle": "送品牌烤箱，五一大促",
                "mainImage": "ac3e571d-13ce-4fad-89e8-c92c2eccf536.jpeg",
                "price": 3299,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 28,
                "categoryId": 100012,
                "name": "【测试学习使用】4+64G送手环/Huawei/华为 nova 手机P9/P10plus青春",
                "subtitle": "NOVA青春版1999元",
                "mainImage": "0093f5d3-bdb4-4fb0-bec5-5465dfd26363.jpeg",
                "price": 1999,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 29,
                "categoryId": 100008,
                "name": "【测试学习使用】Haier/海尔HJ100-1HU1 10公斤滚筒洗衣机全自动带烘干大容量 洗烘一体 厨卫家电",
                "subtitle": "门店机型 德邦送货",
                "mainImage": "173335a4-5dce-4afd-9f18-a10623724c4e.jpeg",
                "price": 4299,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 30,
                "categoryId": 100011,
                "name": "【测试学习使用】thinkpad旗舰本",
                "subtitle": "51大促！非常超值！",
                "mainImage": "f3182089-e21f-4560-a5ce-e600e3408a98.jpeg",
                "price": 4288,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 32,
                "categoryId": 100012,
                "name": "【测试学习使用】iPhone 7 Plus 4G手机，双卡双待，超长待机，纯黑色",
                "subtitle": "疯狂大促，仅售5999",
                "mainImage": "f35cde2b-2f4e-4e2e-80db-a358e8bb7477.jpg",
                "price": 5999,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 33,
                "categoryId": 100029,
                "name": "【测试学习使用】rio/锐澳330ml*6支装饮料 进口洋酒 白酒 红酒 整箱伏特加鸡尾酒",
                "subtitle": "锐澳鸡尾酒330ml*6罐组合套餐，高果汁本榨鸡尾酒系列",
                "mainImage": "755bbbaa-e053-4a2f-8396-790b8ad3b26b.jpg",
                "price": 53,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 34,
                "categoryId": 100007,
                "name": "【测试学习使用】Hisense/海信 LED55EC720US 55吋4K高清智能网络平板液晶电视机",
                "subtitle": "55吋4K高清",
                "mainImage": "dce7d4e1-98f2-485c-a365-e70015c780a1.jpg",
                "price": 4199,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 35,
                "categoryId": 100015,
                "name": "【测试学习使用】hi插座插排插线板接线板配件小家电厨卫家电",
                "subtitle": "性能极佳的插座",
                "mainImage": "69147799-d7cd-4e7a-9a03-a4b7db4f2ae4.jpg",
                "price": 9.9,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            },
            {
                "id": 36,
                "categoryId": 100009,
                "name": "【测试学习使用】Haier/海尔 KFR-33GW/10EBBAL13U1 1.5匹 空调挂机 智能操控",
                "subtitle": "安静的省电的",
                "mainImage": "b6c3ffbb-2107-4b75-9a8d-71c1373f6fbc.jpg",
                "price": 2099,
                "status": 1,
                "imageHost": "http://img.happymmall.com/"
            }
        ],
        "firstPage": 1,
        "prePage": 0,
        "nextPage": 2,
        "lastPage": 2,
        "isFirstPage": true,
        "isLastPage": false,
        "hasPreviousPage": false,
        "hasNextPage": true,
        "navigatePages": 8,
        "navigatepageNums": [
            1,
            2
        ]
    }
};

var page={

    init: function(){
        this.bindEvent();
        this.loadList();
    },

    bindEvent:function () {
        $('.sort-item').click(function () {
            var $_this = $(this);
            var type = $_this.data("type");
            if (type==="default"){
                if($_this.hasClass("active")){
                    return;
                }else{
                    $_this.addClass("active")
                        .siblings(".sort-item")
                        .removeClass("active");
                }
            }else if (type==='price'){
                if($_this.hasClass("asc")){
                    $_this.removeClass("asc");
                    $_this.addClass("active desc").siblings(".sort-item").removeClass("active");
                }else if($_this.hasClass("desc")){
                    $_this.removeClass("desc");
                    $_this.addClass("active asc").siblings(".sort-item").removeClass("active");
                }else{
                    return;
                }
            }
        });
    },
    loadList:function () {
        var $pListCon = $(".p-list-con");
        var  listHtml = _mm.renderHtml(templateIndex, {
            list :  res.data.list
        });
        $pListCon.html(listHtml);
    }

};

$(function () {
    page.init();
});


