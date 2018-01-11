/**
 * index.html对应js
 * Created by yu
 * on 2018/1/10.
 */

require('./index.css');
layui.use(['bodyTab','form','element','layer','jquery'], function(){
    var form = layui.form;
    //监听提交
    /*form.on('submit(formDemo)', function(data){
        layer.msg(JSON.stringify(data.field));
        return false;
    });*/
    var tab = layui.bodyTab({
        openTabNum : "50",  //最大可打开窗口数量
        url : "../plugin/layui/json/navs.json" //获取菜单json地址
    });
    tab.render();
});