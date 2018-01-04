/**
 * Created by yu
 * on 2018/1/2.
 */
require('./main.css');
require('common/nav-operation/nav-operation.js');
require('common/nav-search/nav-search.js');
require('utils/plugin/slider/slider');
var _mm = require('utils/mm.js')
var templateBanner  = require('./banner.string');


$(function () {

    // 渲染banner的html
    var bannerHtml = _mm.renderHtml(templateBanner);
    $('.slider').html(bannerHtml);
    //初始化banner
    var unSlider = $('.banner').unslider({
        speed: 500,               //  The speed to animate each slide (in milliseconds)
        delay: 3000,              //  The delay between slide animations (in milliseconds)
        complete: function () {
        },  //  A function that gets called after every slide animation
        keys: true,               //  Enable keyboard (left, right) arrow shortcuts
        dots: true,               //  Display dot navigation
        fluid: false              //  Support responsive design. May break non-responsive designs
    });
    //添加banner的上一页、下一页事件
    $('.slider .banner').click(function () {
        var forward = $(this).hasClass('prev') ? 'prev' : 'next';
        unSlider.data('unslider')[forward]();
    });
});

