/**
 * Created by yu
 * on 2018/3/13.
 */
require('./product-add.css');
var _product = require("service/product-service.js");
var _usual = require("service/usual-service.js");
var _category = require("service/product-category-service.js");

layui.use(['form', 'layer', 'upload'], function () {
    var form = layui.form();
    layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    var subImage;

    layui.upload({// /api/upload/v1/img
        url: '/api/upload/v1/img'
        , success: function (res) {
            console.log(res); //上传成功返回值，必须为json格式
            $('#main-img-thumb').attr('src', res.data.serverAddress + res.data.src);
            $('#mainImage').val(res.data.src);
        }
    });

    //--- 填充分类父级分类的数据
    $("#categoryValue").click(function () {
        $("#menuContent").slideToggle("fast");
        _category.getAllProductCategory(
            function (res) {
                var zNodes = res;
                $.fn.zTree.init($("#categoryValueTree"), setting, zNodes);
            }, function () {

            });
    });

    var isFirst = true;

    //--------富文本编辑
    var E = window.wangEditor;
    var editor = new E('#product-detail');
    editor.customConfig.uploadImgServer = '/api/upload/v1/img';
    editor.customConfig.uploadFileName = 'file';
    editor.customConfig.uploadImgMaxSize = 4 * 1024 * 1024;
    //editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
            // 图片上传之前触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
            // return {
            //     prevent: true,
            //     msg: '放弃上传'
            // }
        },
        success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        },
        error: function (xhr, editor) {
            // 图片上传出错时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        timeout: function (xhr, editor) {
            // 图片上传超时时触发
            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
        },
        customInsert: function (insertImg, result, editor) {
            var serverAddress = result.data.serverAddress;
            var imgSrc = result.data.src;
            var url = serverAddress + imgSrc;
            if (isFirst) {
                subImage += imgSrc;
                isFirst = false;
            } else {
                subImage += ("#" + imgSrc);
            }
            insertImg(url);
            // result 必须是一个 JSON 格式字符串！！！否则报错
        }
    };
    editor.create();
    form.on('submit(addProduct)', function (from) {
        var handlingIndex = layer.load(2, {time: 10 * 1000});
        //去除图片中的serverAddress（保留图片的相对路径）
        _usual.getUploadServerAddress(
            function (data) {
                var serverAddress = data;
                console.log(serverAddress);
                var productDetail = editor.txt.html().replace(new RegExp(serverAddress, 'g'), "");
                var formJson = from.field;
                formJson.detail = productDetail;
                formJson.subImage = subImage;
                delete formJson["file"];//删除json中的file属性
                var productId = formJson.productId;
                var formData = JSON.stringify(formJson);
                if (productId === null || productId === undefined || productId === '') {//添加
                    delete formJson["productId"];
                    _product.addProduct(
                        formData,
                        function () {
                            layer.msg("添加商品成功");
                            layer.close(handlingIndex);
                            //先得到当前iframe层的索引
                            window.parent.location.reload();
                             var index = parent.layer.getFrameIndex(window.name);
                             parent.layer.close(index);
                        },
                        function (errorMsg) {
                            layer.msg(errorMsg);
                            layer.close(handlingIndex);
                        });
                } else {//修改
                    _product.updateProduct(
                        formData,
                        function () {
                            layer.msg("修改成功");
                            layer.close(handlingIndex);
                            window.parent.location.reload();
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.layer.close(index);
                        },
                        function (errorMsg) {
                            layer.msg(errorMsg);
                            layer.close(handlingIndex);
                        });
                }
                //console.log("formData=="+formData);
            },
            function () {

            });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

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
        var zTree = $.fn.zTree.getZTreeObj("categoryValueTree"),
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
        var categoryValue = $("#categoryValue");
        categoryValue.val(v);
        // 将选中的id放到隐藏的文本域中
        if (ids.length > 0) ids = ids.substring(0, ids.length - 1);
        var treeids = $("#categoryId");
        treeids.attr("value", ids);
        $("#menuContent").fadeOut("fast");
    }


});