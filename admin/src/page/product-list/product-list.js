/**
 * 商品信息页面对应js
 *
 * Created by yu
 * on 2018/2/5.
 */
require('./product-list.css');

layui.use(['paging', 'form'], function() {
    var $ = layui.jquery,
        paging = layui.paging(),
        layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
        layer = layui.layer, //获取当前窗口的layer对象
        form = layui.form();

    paging.init({
        openWait: true,
        url: 'api/product/v1/products/categories/6', //地址
        elem: '#content', //内容容器
        params: { //发送到服务端的参数
            categoryId:6
        },
        type: 'GET',
        tempElem: '#tpl', //模块容器
        pageConfig: { //分页参数配置
            elem: '#paged', //分页容器
            size: 15 //分页大小
        },
        success: function() { //渲染成功的回调
            //alert('渲染成功');
        },
        fail: function(msg) { //获取数据失败的回调
            //alert('获取数据失败')
        },
        complate: function() { //完成的回调
            //alert('处理完成');
            //重新渲染复选框
            form.render('checkbox');
            form.on('checkbox(allselector)', function(data) {
                var elem = data.elem;
                $('#content').children('tr').each(function() {
                    var $that = $(this);
                    //全选或反选
                    $that.children('td').eq(0).children('input[type=checkbox]')[0].checked = elem.checked;
                    form.render('checkbox');
                });
            });

            //绑定所有编辑按钮事件
            $('#content').children('tr').each(function() {
                var $that = $(this);
                $that.children('td:last-child').children('a[data-opt=edit]').on('click', function() {
                    layer.msg($(this).data('name'));
                });
            });
        },
    });
    //获取所有选择的列
    $('#getSelected').on('click', function() {
        var idList  = new Array;
        $('#content').children('tr').each(function() {
            var $that = $(this);
            var $cbx = $that.children('td').eq(0).children('input[type=checkbox]')[0].checked;
            if($cbx) {
                var id = $that.children('td:last-child').children('a[data-opt=edit]').data('id');
                idList.push(id);
            }
        });
        layer.msg('你选择的id：' + idList.length);
    });
    var addBoxIndex = -1;
    $('#add').on('click', function() {
        if(addBoxIndex !== -1)
            return;
        //本表单通过ajax加载 --以模板的形式，当然你也可以直接写在页面上读取
        $.get('../view/product-add.html', null, function(form) {
            addBoxIndex = layer.open({
                type: 1,
                title: '添加表单',
                content: form,
                btn: ['保存', '取消'],
                shade: [0.8, '#FFF'],
                offset: 'auto',
                area: ['600px', '500px'],
                zIndex: 2,
                resize : true,
                /* maxmin: true,*/
                yes: function(index) {
                    //触发表单的提交事件
                    $('form.layui-form').find('button[lay-filter=edit]').click();
                },
                full: function(elem) {
                    var win = window.top === window.self ? window : parent.window;
                    $(win).on('resize', function() {
                        var $this = $(this);
                        elem.width($this.width()).height($this.height()).css({
                            top: 0,
                            left: 0
                        });
                        elem.children('div.layui-layer-content').height($this.height() - 95);
                    });
                },
                success: function(layero, index) {
                    //弹出窗口成功后渲染表单
                    var form = layui.form();
                    form.render();
                    form.on('submit(edit)', function(data) {
                        console.log(data.elem); //被执行事件的元素DOM对象，一般为button对象
                        console.log(data.form) ;//被执行提交的form对象，一般在存在form标签时才会返回
                        console.log(data.field) ;//当前容器的全部表单字段，名值对形式：{name: value}
                        //调用父窗口的layer对象
                        layerTips.open({
                            title: '这里面是表单的信息',
                            type: 1,
                            content: JSON.stringify(data.field),
                            area: ['500px', '300px'],
                            btn: ['关闭并刷新', '关闭'],
                            yes: function(index, layero) {
                                layerTips.msg('你点击了关闭并刷新');
                                layerTips.close(index);
                                location.reload(); //刷新
                            }

                        });
                        //这里可以写ajax方法提交表单
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                    //console.log(layero, index);
                },
                end: function() {
                    addBoxIndex = -1;
                }
            });
        });
    });

});