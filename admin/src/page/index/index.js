/**
 * index.html对应js
 * Created by yu
 * on 2018/1/10.
 */

require('./index.css');
var _menu = require("service/menu-service.js");
var tab;
var form;
var navbar;
layui.use(['element', 'form', 'layer', 'navbar', 'tab', 'jquery'], function () {
    var element = layui.element(),
        $ = layui.jquery,
        layer = layui.layer,
        navbar = layui.navbar();
    tab = layui.tab({
        //设置选项卡容器
        elem: '.admin-nav-card'
        ,
        /* maxSetting: {
         max: 5,
         tipMsg: '只能开5个哇，不能再开了。真的。'
         },*/
        contextMenu: true,
        onSwitch: function (data) {
            /*  console.log(data.id); //当前Tab的Id
             console.log(data.index); //得到当前Tab的所在下标
             console.log(data.elem); //得到当前的Tab大容器
             console.log(tab.getCurrentTabId())*/
        },
        //tab 关闭之前触发的事件
        closeBefore: function (obj) {
            console.log(obj);
            //obj.title  -- 标题
            //obj.url    -- 链接地址
            //obj.id     -- id
            //obj.tabId  -- lay-id
            if (obj.title === 'BTable') {
                layer.confirm('确定要关闭' + obj.title + '吗?', {icon: 3, title: '系统提示'}, function (index) {
                    //因为confirm是非阻塞的，所以这里关闭当前tab需要调用一下deleteTab方法
                    tab.deleteTab(obj.tabId);
                    layer.close(index);
                });
                //返回true会直接关闭当前tab
                return false;
            } else if (obj.title === '表单') {
                layer.confirm('未保存的数据可能会丢失哦，确定要关闭吗?', {icon: 3, title: '系统提示'}, function (index) {
                    tab.deleteTab(obj.tabId);
                    layer.close(index);
                });
                return false;
            }
            return true;
        }
    });
    //iframe自适应
    $(window).on('resize', function () {
        var $content = $('.admin-nav-card .layui-tab-content');
        $content.height($(this).height() - 150);
        $content.find('iframe').each(function () {
            $(this).height($content.height());
        });
    }).resize();
    //清除缓存
    $('#clearCached').on('click', function () {
        navbar.cleanCached();
        layer.alert('清除完成!', {icon: 1, title: '系统提示'}, function () {
            location.reload();//刷新
        });
    });

    //刷新当前页
    $(".refreshThis").click(function () {
        tab.refreshThis();
    });
    //关闭其它页
    $(".closePageOther").click(function () {
        tab.deleteTabOther();
    });
    //关闭所有页
    $(".closePageAll").click(function () {
        tab.deleteTabAll();
    });
    //获取用户对应的菜单
    _menu.getMenusByUserId(2 , function (data) {
        //设置navbar
        navbar.set({
            spreadOne: true,
            elem: '#admin-navbar-side',
            cached: true,
            data: data
        });
        //渲染navbar
        navbar.render();
        //监听点击事件
        navbar.on('click(side)', function (data) {
            tab.tabAdd(data.field);
        });
        console.log("data:::"+data);
    });

});