/**
 * 商品分类相关js
 *
 * Created by yu
 * on 2018/2/5.
 */
require('./product-category-list.css');
require('../common/bTable.css');
var _category = require("service/product-category-service.js");

layui.use(['btable','form'], function () {
    var $ = layui.jquery,
        btable = layui.btable(),
        layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
        layer = layui.layer, //获取当前窗口的layer对象
        form = layui.form();

    //---初始化表单数据
    btable.set({
        openWait: true,//开启等待框
        elem: '#content',
        url: '/api/product/v1/categories', //数据源地址
        pageSize: 10,//页大小
        even: true,//隔行变色
        field: 'categoryId', //主键ID
        /*skin: 'row',*/
        checkbox: true,//是否显示多选框
        paged: true, //是否显示分页
        singleSelect: false, //只允许选择一行，checkbox为true生效
        params: {//额外的请求参数
            t: new Date().getTime()
        },
        columns: [
            { //配置数据列
                fieldName: '父节点', //显示名称
                field: 'parentId', //字段名
                sortable: true, //是否显示排序
                format: function (val, obj) {
                    var parentId = val;
                    if(parentId===null || parentId===''){
                        return '没有父节点'
                    }else{
                        return parentId
                    }
                }
            },
            {
                fieldName: '分类名称',
                field: 'name'
            },
            {
                fieldName: '序列号',
                field: 'code',
                sortable: true
            },
            {
                fieldName: '创建时间',
                field: 'createTime',
                sortable: true,
                format: function (val, obj) {
                    var newDate = new Date();
                    newDate.setTime(val);
                    return newDate.toLocaleString();

                }
            },
            {
                fieldName: '操作',
                field: 'categoryId',
                format: function (val, obj) {
                    var html =
                        '<input type="button" value="编辑" data-action="edit" data-id="' + val + '" class="layui-btn layui-btn-mini" /> ' +
                        '<input type="button" value="删除" data-action="del" data-id="' + val + '" class="layui-btn layui-btn-mini layui-btn-danger" />';
                    return html;
                }
            }],
        onSuccess: function ($elem) { //$elem当前窗口的jq对象
            $elem.children('tr').each(function () {
                $(this).children('td:last-child').children('input').each(function () {
                    var $that = $(this);
                    var action = $that.data('action');
                    var categoryId = $that.data('id');
                    $that.on('click', function () {
                        switch (action) {
                            //---编辑分类
                            case 'edit':
                                var handlingIndex;
                                $.get('../view/product-category-edit.html', null, function (form) {
                                    addBoxIndex = layer.open({
                                        type: 1,
                                        title: '修改用户信息',
                                        content: form,
                                        btn: ['保存', '取消'],
                                        shade: [0.8, '#FFF'],
                                        offset: 'auto',
                                        area: ['600px', '500px'],
                                        zIndex: 2,
                                        resize: true,
                                        /* maxmin: true,*/
                                        yes: function (index) {
                                            //触发表单的提交事件
                                            $('form.layui-form').find('button[lay-filter=editProductCategory]').click();
                                        },
                                        full: function (elem) {
                                            var win = window.top === window.self ? window : parent.window;
                                            $(win).on('resize', function () {
                                                var $this = $(this);
                                                elem.width($this.width()).height($this.height()).css({
                                                    top: 0,
                                                    left: 0
                                                });
                                                elem.children('div.layui-layer-content').height($this.height() - 95);
                                            });
                                        },
                                        success: function (layero, index) {
                                            //填充数据
                                            var inflateIndex = layer.load(2, {time: 10 * 1000});
                                            //--- 填充分类父级分类的数据
                                            $("#parentValue").click(function () {
                                                $("#menuContent").slideToggle("fast");
                                                _category.getAllProductCategory(
                                                    function (res) {
                                                        var zNodes = res;
                                                        $.fn.zTree.init($("#parentValueTree"), setting, zNodes);
                                                    } , function () {

                                                    });
                                            });
                                            _category.getProductCategoryById(categoryId,
                                                function (res) {
                                                    var body = layer.getChildFrame('body', index);
                                                    var category = res;
                                                    $("#categoryId").val("" + category.categoryId);
                                                    $("#parentValue").val("" + category.parentName);
                                                    $("#parentId").val("" + category.parentId);
                                                    $("#name").val("" + category.name);
                                                    $("#code").val("" + category.code);
                                                    layer.close(inflateIndex);
                                                },
                                                function (errorMsg) {
                                                    layer.msg('' + errorMsg);
                                                    layer.close(inflateIndex);
                                                });
                                            //弹出窗口成功后渲染表单
                                            var form = layui.form();
                                            form.render();
                                            //表单提交
                                            form.on('submit(editProductCategory)', function (data) {
                                                handlingIndex = layer.load(2, {time: 10 * 1000});
                                                _category.updateProductCategory(JSON.stringify(data.field),
                                                    function () {
                                                        layer.msg("分类信息修改成功");
                                                        layerTips.close(addBoxIndex);
                                                        layer.close(handlingIndex);
                                                        location.reload(); //刷新
                                                    },
                                                    function (errorMsg) {
                                                        layer.close(handlingIndex);
                                                        layer.msg('' + errorMsg);
                                                    });
                                                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                                            });
                                        },
                                        end: function () {
                                            addBoxIndex = -1;
                                        }
                                    });
                                });
                                break;
                            //---单个删除用户信息
                            case 'del':
                                var categoryName = $that.parent('td').siblings('td[data-field=name]').text();
                                layer.confirm('确定要删除[ <span style="color:red;">' + categoryName + '</span> ] ?', {icon: 3, title: '操作提示'}, function (index) {
                                    //删除用户操作
                                    var handlingIndex = layer.load(2, {time: 10 * 1000});
                                    _category.deleteProductCategoryById(categoryId,
                                        function () {
                                            layer.msg('成功删除 '+categoryName);
                                            layer.close(handlingIndex);
                                            location.reload();
                                        },
                                        function (errorMsg) {
                                            layer.msg('' + errorMsg);
                                            layer.close(handlingIndex);
                                        })
                                });
                                break;
                        }
                    });
                });
            });
        }
    });
    btable.render();

    //监听搜索表单的提交事件
    form.on('submit(search)', function (data) {
        btable.get(data.field);
        return false;
    });

    //---批量删除
    $('#deleteSelected').on('click', function () {

        btable.getSelections(function (data) {
            var count = data.count;
            var ids = data.ids;
            layer.confirm('确定要删除选中的  <span style="color:red; font-size: 13px">' + count + '</span>  条数据?', {icon: 3, title: '操作提示'}, function (index) {
                var handlingIndex = layer.load(2, {time: 10 * 1000});
                _category.deleteProductCategoryByIdList(JSON.stringify(ids),
                    function () {
                        location.reload();
                        layer.msg("删除成功");
                        layer.close(handlingIndex);
                    },
                    function (errorMsg) {
                        layer.msg("" + errorMsg);
                        layer.close(handlingIndex);
                    });
            });
        });

    });

    //---添加用户
    var addBoxIndex = -1;
    $('#add').on('click', function () {
        if (addBoxIndex !== -1)
            return;
        //本表单通过ajax加载 --以模板的形式，当然你也可以直接写在页面上读取
        var handlingIndex;
        $.get('../view/product-category-add.html', null, function (form) {
            addBoxIndex = layer.open({
                type: 1,
                title: '添加商品分类',
                content: form,
                btn: ['保存', '取消'],
                shade: [0.8, '#FFF'],
                offset: 'auto',
                area: ['600px', '500px'],
                zIndex: 2,
                resize: true,
                /* maxmin: true,*/
                yes: function (index) {
                    //触发表单的提交事件
                    $('form.layui-form').find('button[lay-filter=addProductCategory]').click();
                },
                full: function (elem) {
                    var win = window.top === window.self ? window : parent.window;
                    $(win).on('resize', function () {
                        var $this = $(this);
                        elem.width($this.width()).height($this.height()).css({
                            top: 0,
                            left: 0
                        });
                        elem.children('div.layui-layer-content').height($this.height() - 95);
                    });
                },
                success: function (layero, index) {
                    //弹出窗口成功后渲染表单
                    var form = layui.form();
                    form.render();

                    //--- 填充分类父级分类的数据
                    $("#parentValue").click(function () {
                        $("#menuContent").slideToggle("fast");
                        _category.getAllProductCategory(
                            function (res) {
                                var zNodes = res;
                                $.fn.zTree.init($("#parentValueTree"), setting, zNodes);
                            } , function () {

                            });
                    });
                    //表单验证
                    //表单提交
                    form.on('submit(addProductCategory)', function (data) {
                        var handlingIndex = layer.load(2, {time: 10 * 1000});
                        //---TODO 添加分类请求
                        _category.addProductCategory(JSON.stringify(data.field) ,
                            function () {
                                layer.msg('添加角色成功');
                                layer.close(addBoxIndex);
                                layer.close(handlingIndex);
                                location.reload(); //刷新
                        },
                            function (errorMsg) {
                                layer.close(handlingIndex);
                                layer.msg('' + errorMsg);
                        });

                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                },
                end: function () {
                    addBoxIndex = -1;
                }
            });
        });
    });

    /*绑定字典内容到指定的Select控件*/
    function bindSelect(selectId, url) {
        var control = $('#' + selectId);
        //绑定Ajax的内容
        $.getJSON(url, function (result) {
            control.empty();//清空下拉框
            var data = result.data;
            $.each(data, function (i, item) {
                var checked = item.checked;
                if (checked) {
                    control.append("<option selected value='" + item.roleId + "'>&nbsp;" + item.roleName + "</option>");
                } else {
                    control.append("<option  value='" + item.roleId + "'>&nbsp;" + item.roleName + "</option>");
                }
            });
            //设置Select2的处理
            control.select2({
                allowClear: true,
                escapeMarkup: function (m) {
                    return m;
                }
            });
        });
    }

    //---zTree配置
    var setting = {
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: onClick
        },
        view: {
            // 不显示对应的图标
            showIcon: false
        }
    };
    function onClick(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("parentValueTree"),
            nodes = zTree.getSelectedNodes(),
            v = "";
        ids = "";
        nodes.sort(function compare(a,b){return a.id-b.id;});
        for (var i=0, l=nodes.length; i<l; i++) {
            v += nodes[i].name + ",";
            ids += nodes[i].id + ",";
        }
        if (v.length > 0 ) v = v.substring(0, v.length-1);
        var parentValue = $("#parentValue");
        parentValue.val(v);
        // 将选中的id放到隐藏的文本域中
        if (ids.length > 0 ) ids = ids.substring(0, ids.length-1);
        var treeids = $("#parentId");
        treeids.attr("value", ids);
        $("#menuContent").fadeOut("fast");
    }


});