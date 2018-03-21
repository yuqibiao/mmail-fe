/**
 * 商品信息页面对应js
 *
 * Created by yu
 * on 2018/2/5.
 */
require('./product-list.css');
require('../common/bTable.css');
var _product = require("service/product-service.js");

layui.use(['btable', 'form'], function () {
    var $ = layui.jquery,
        btable = layui.btable(),
        layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
        layer = layui.layer, //获取当前窗口的layer对象
        form = layui.form();

    //---初始化表单数据
    btable.set({
        openWait: true,//开启等待框
        elem: '#content',
        url: '/api/product/v1/products/categories/6', //数据源地址
        pageSize: 10,//页大小
        even: true,//隔行变色
        field: 'productId', //主键ID
        /*skin: 'row',*/
        checkbox: true,//是否显示多选框
        paged: true, //是否显示分页
        singleSelect: false, //只允许选择一行，checkbox为true生效
        params: {//额外的请求参数
            t: new Date().getTime()
        },
        columns: [
            { //配置数据列
                fieldName: '所属分类', //显示名称
                field: 'categoryId', //字段名
                sortable: true, //是否显示排序
                format: function (val, obj) {
                    var parentId = val;
                    if (parentId === null || parentId === '') {
                        return '没有父节点'
                    } else {
                        return parentId
                    }
                }
            },
            {
                fieldName: '商品名称',
                field: 'name'
            },
            {
                fieldName: '主图',
                field: 'mainImage',
                format: function (val, obj) {
                    var html = '<img src="' + val + '" height="60"  alt="" layer-index="0">';
                    return html;
                }
            },
            {
                fieldName: '商品简介',
                field: 'subtitle'
            },
            {
                fieldName: '商品价格',
                field: 'price',
                sortable: true
            },
            {
                fieldName: '库存',
                field: 'stock'
            },
            {
                fieldName: '状态',
                field: 'status',
                sortable: true
            },
         /*   {
                fieldName: '创建时间',
                field: 'createTime',
                sortable: true,
                format: function (val, obj) {
                    var newDate = new Date();
                    newDate.setTime(val);

                    return newDate.toLocaleString();
                }
            },*/
            {
                fieldName: '操作',
                field: 'productId',
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
                    var productId = $that.data('id');
                    $that.on('click', function () {
                        switch (action) {
                            //---编辑商品
                            case 'edit':
                                _product.getProductById(
                                    productId,
                                    function (data) {
                                        var product = data;
                                        var index = layui.layer.open({
                                            title: "添加商品",
                                            type: 2,
                                            content: "product-add.html",
                                            success: function (layero, index) {
                                                var body = layui.layer.getChildFrame('body', index);
                                                body.find("#productId").val(product.productId);
                                                body.find("#name").val(product.name);
                                                body.find("#mainImage").val(product.mainImage);
                                                var mainImgUrl = product.serverAddress + product.mainImage;
                                                body.find('#main-img-thumb').attr('src', mainImgUrl);
                                                body.find("#categoryId").val(product.categoryId);
                                                body.find("#categoryValue").val(product.categoryName);
                                                body.find("#price").val(product.price);
                                                body.find("#stock").val(product.stock);
                                                body.find("#subtitle").val(product.subtitle);
                                                //-- 处理图片地址(让服务器处理了)
                                               /* var serverAddress = product.serverAddress;
                                                var detail = product.detail;
                                                var el = $( '<div></div>' );
                                                el.html(detail);
                                                var imgList = $('img', el).attr("src","");
                                                for (var i=0 ; i<imgList.length ; i++){
                                                    var before = imgList[i].src;
                                                    imgList[i].src=serverAddress+before;
                                                }
                                                var detailAfter = el.html();
                                                console.log(detailAfter);
                                                body.find(".w-e-text").html(detailAfter);*/
                                               //console.log("product.detail==="+product.detail);
                                                body.find(".w-e-text").html(product.detail);
                                                setTimeout(function () {
                                                    layui.layer.tips('点击此处返回商品列表', '.layui-layer-setwin .layui-layer-close', {
                                                        tips: 3
                                                    });
                                                }, 1000)
                                            }
                                        });
                                        layui.layer.full(index);
                                        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
                                        $(window).on("resize", function () {
                                            layui.layer.full(index);
                                        });
                                    },
                                    function () {
                                    });
                                break;
                            //---单个删除用户信息
                            case 'del':
                                var productName = $that.parent('td').siblings('td[data-field=name]').text();
                                layer.confirm('确定要删除[ <span style="color:red;">' + productName + '</span> ] ?', {
                                    icon: 3,
                                    title: '操作提示'
                                }, function (index) {
                                    //删除用户操作
                                    var handlingIndex = layer.load(2, {time: 10 * 1000});
                                    _product.deleteProductById(productId,
                                        function () {
                                            layer.msg('成功删除 ' + productName);
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
            layer.confirm('确定要删除选中的  <span style="color:red; font-size: 13px">' + count + '</span>  条数据?', {
                icon: 3,
                title: '操作提示'
            }, function (index) {
                var handlingIndex = layer.load(2, {time: 10 * 1000});
                _product.deleteProductByIdList(
                    JSON.stringify(ids),
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

    //---添加商品
    var addBoxIndex = -1;
    $('#add').on('click', function () {
        if (addBoxIndex !== -1)
            return;
        //本表单通过ajax加载 --以模板的形式，当然你也可以直接写在页面上读取
        var index = layui.layer.open({
            title: "添加商品",
            type: 2,
            content: "product-add.html",
            success: function (layero, index) {
                var body = layui.layer.getChildFrame('body', index);
                setTimeout(function () {
                    layui.layer.tips('点击此处返回商品列表', '.layui-layer-setwin .layui-layer-close', {
                        tips: 3
                    });
                }, 1000)
            }
        });
        layui.layer.full(index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function () {
            layui.layer.full(index);
        })
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
        nodes.sort(function compare(a, b) {
            return a.id - b.id;
        });
        for (var i = 0, l = nodes.length; i < l; i++) {
            v += nodes[i].name + ",";
            ids += nodes[i].id + ",";
        }
        if (v.length > 0) v = v.substring(0, v.length - 1);
        var parentValue = $("#parentValue");
        parentValue.val(v);
        // 将选中的id放到隐藏的文本域中
        if (ids.length > 0) ids = ids.substring(0, ids.length - 1);
        var treeids = $("#parentId");
        treeids.attr("value", ids);
        $("#menuContent").fadeOut("fast");
    }


});