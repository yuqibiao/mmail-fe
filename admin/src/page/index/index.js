/**
 * index.html对应js
 * Created by yu
 * on 2018/1/10.
 */

require('./index.css');
var tab;
var form;
layui.use(['bodyTab', 'form', 'element', 'layer', 'jquery'], function () {
    form = layui.form;
    //监听提交
    /*form.on('submit(formDemo)', function(data){
     layer.msg(JSON.stringify(data.field));
     return false;
     });*/
    tab = layui.bodyTab({
        openTabNum: "50",  //最大可打开窗口数量
        url: "../plugin/layui/json/navs.json" //获取菜单json地址
    });
    tab.render();

    //隐藏左侧导航
    $(".left-menu-switch").click(function () {
        console.log("==========")
        $(".layui-layout-admin").toggleClass("showMenu");
        //渲染顶部窗口
        tab.tabMove();
    })

    // 添加新窗口
    $("body").on("click", ".layui-nav .layui-nav-item a", function () {
        //如果不存在子级
        if ($(this).siblings().length == 0) {
            addTab($(this));
            $('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
        }
        $(this).parent("li").siblings().removeClass("layui-nav-itemed");
    })

});

//打开新窗口
function addTab(_this) {
    tab.tabAdd(_this);
}