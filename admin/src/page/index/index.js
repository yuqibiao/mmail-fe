/**
 * index.html对应js
 * Created by yu
 * on 2018/1/10.
 */

require('./index.css');
var tab;
var form;
layui.use(['element', 'layer', 'navbar', 'tab'], function () {
    var element = layui.element(),
        $ = layui.jquery,
        layer = layui.layer,
        navbar = layui.navbar();
    tab = layui.tab({
        elem: '.admin-nav-card' //设置选项卡容器
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
        closeBefore: function (obj) { //tab 关闭之前触发的事件
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

    //设置navbar
    navbar.set({
        spreadOne: true,
        elem: '#admin-navbar-side',
        cached: false,
       /* data: navs*/
         url: '../plugin/layui/json/navs.json'
    });
    //渲染navbar
    navbar.render();
    //监听点击事件
    navbar.on('click(side)', function (data) {
        tab.tabAdd(data.field);
    });
    //清除缓存
    $('#clearCached').on('click', function () {
        navbar.cleanCached();
        layer.alert('清除完成!', {icon: 1, title: '系统提示'}, function () {
            location.reload();//刷新
        });
    });

    $(".refreshThis").click(function () {//刷新当前页
        tab.refreshThis();
    });
    $(".closePageOther").click(function () {//关闭其它页
        tab.deleteTabOther();
    });
    $(".closePageAll").click(function () {//关闭所有页
        tab.deleteTabAll();
    });

});
