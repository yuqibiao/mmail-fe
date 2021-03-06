/**
 * 角色展示
 *
 * Created by yu
 * on 2018/2/5.
 */
require('./role-list.css');
require('../common/bTable.css');
var _role = require("service/role-service.js");
layui.use(['btable','paging', 'form'], function() {
    var $ = layui.jquery,
        btable = layui.btable(),
        layerTips = parent.layer === undefined ? layui.layer : parent.layer, //获取父窗口的layer对象
        layer = layui.layer, //获取当前窗口的layer对象
        form = layui.form();

    //---初始化表单数据
    btable.set({
        openWait: true,//开启等待框
        elem: '#content',
        url: '/api/role/v1/roles', //数据源地址
        pageSize: 10,//页大小
        even: true,//隔行变色
        field: 'roleId', //主键ID
        /*skin: 'row',*/
        checkbox: true,//是否显示多选框
        paged: true, //是否显示分页
        singleSelect: false, //只允许选择一行，checkbox为true生效
        params: {//额外的请求参数
            t: new Date().getTime()
        },
        columns: [
            { //配置数据列
                fieldName: '角色名',
                field: 'name', //字段名
                sortable: true//是否显示排序
            },
            { //配置数据列
                fieldName: '角色别名',
                field: 'alias'
            },
            {
                fieldName: '序列号',
                field: 'code',
                sortable: true,
            },
            {
                fieldName: '权限描述',
                field: 'description'
            },
            {
                fieldName: '状态',
                field: 'status',
                sortable: true,
                format: function (val, obj) {
                    if (val===0){
                        return "可用";
                    }else if(val===1){
                        return"禁用";
                    }
                }
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
                field: 'roleId',
                format: function (val, obj) {
                    var html =
                        '<input type="button" value="权限分配" data-action="permission" data-id="' + val + '" class="layui-btn layui-btn-mini" /> ' +
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
                    var roleId = $that.data('id');
                    $that.on('click', function () {
                        switch (action) {
                            //---权限分配
                            case "permission":
                                $.get('../view/role-permission-assignment.html', null, function (form) {
                                    boxIndex = layer.open({
                                        type: 1,
                                        title: '角色权限分配',
                                        content: form,
                                        btn: ['保存', '取消'],
                                        shade: [0.8, '#FFF'],
                                        offset: 'auto',
                                        area: ['300px', '500px'],
                                        zIndex: 2,
                                        resize: true,
                                        /* maxmin: true,*/
                                        yes: function (index) {
                                           //保存权限的修改
                                            var perIdList = new Array();
                                            var treeObj = $.fn.zTree.getZTreeObj("permissionTree");
                                            var nodes = treeObj.getCheckedNodes(true);
                                            for(var i=0 ; i<nodes.length ; i++){
                                                var node = nodes[i];
                                                var perId = node.id;
                                                perIdList.push(perId);
                                            }
                                            var requestData = {
                                                roleId:roleId,
                                                permissionIdList:perIdList
                                            };
                                            requestData = JSON.stringify(requestData);
                                            var updateIndex = layer.load(2, {time: 10 * 1000});
                                            _role.updateRolePermission(
                                                requestData,
                                                function () {
                                                    layer.close(updateIndex);
                                                    layer.close(boxIndex);
                                                    layer.msg('权限更新成功');
                                            },
                                                function (errorMsg) {
                                                    layer.close(updateIndex);
                                                    layer.msg('' + errorMsg);
                                            })
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
                                            //获取角色对应的权限信息并填充ztree
                                            _role.getAllPermissionById(roleId ,
                                                function (res) {
                                                var zNodes = res;
                                                $.fn.zTree.init($("#permissionTree"), setting, zNodes);
                                                setCheck();
                                                layer.close(inflateIndex);
                                            },
                                                function (errorMsg) {
                                                    layer.close(inflateIndex);
                                                    layer.msg('' + errorMsg);
                                                });
                                            //弹出窗口成功后渲染表单
                                            var form = layui.form();
                                            form.render();

                                        },
                                        end: function () {
                                            boxIndex = -1;
                                        }
                                    });
                                });
                                break;
                            //---编辑角色
                            case 'edit':
                                var handlingIndex;
                                $.get('../view/role-edit.html', null, function (form) {
                                    boxIndex = layer.open({
                                        type: 1,
                                        title: '修改角色信息',
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
                                            $('form.layui-form').find('button[lay-filter=editRole]').click();
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
                                            _role.getRoleById(roleId,
                                                function (res) {
                                                    var body = layer.getChildFrame('body', index);
                                                    var role = res;
                                                    $("#roleId").val("" + role.roleId);
                                                    $("#name").val("" + role.name);
                                                    $("#alias").val("" + role.alias);
                                                    $("#description").val("" + role.description);
                                                    $("#code").val("" + role.code);
                                                    var statusVal = role.status;
                                                    $(":radio[name='status'][value='"+statusVal+"']").prop("checked", "checked");
                                                    //---这个不能少！！！！
                                                    form.render('radio');
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
                                            form.on('submit(editRole)', function (data) {
                                                handlingIndex = layer.load(2, {time: 10 * 1000});
                                                _role.updateRole(JSON.stringify(data.field),
                                                    function () {
                                                        layer.msg("角色信息修改成功");
                                                        layer.close(boxIndex);
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
                                            boxIndex = -1;
                                        }
                                    });
                                });
                                break;
                            //---单个删除用户信息
                            case 'del':
                                var name = $that.parent('td').siblings('td[data-field=name]').text();
                                layer.confirm('确定要删除[ <span style="color:red;">' + name + '</span> ] ?', {icon: 3, title: '操作提示'}, function (index) {
                                    //删除用户操作
                                    var handlingIndex = layer.load(2, {time: 10 * 1000});
                                    _role.deleteRoleById(roleId,
                                        function () {
                                            layer.msg('成功删除 '+name);
                                            layer.close(handlingIndex);
                                            location.reload();
                                        },
                                        function (errorMsg) {
                                            layer.msg('' + errorMsg);
                                            layer.close(handlingIndex);
                                        });
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

    //---批量删除角色
    $('#deleteSelected').on('click', function () {

        btable.getSelections(function (data) {
            layer.msg("选中的Id有：" + data.ids);
            var count = data.count;
            var ids = data.ids;
            layer.confirm('确定要删除选中的  <span style="color:red; font-size: 13px">' + count + '</span>  条数据?', {icon: 3, title: '操作提示'},
                function (index) {
                var handlingIndex = layer.load(2, {time: 10 * 1000});
                _role.deleteRoleByIdList(JSON.stringify(ids),
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


    //---添加角色
    var boxIndex = -1;
    $('#add').on('click', function () {
        if (boxIndex !== -1)
            return;
        //本表单通过ajax加载 --以模板的形式，当然你也可以直接写在页面上读取
        var handlingIndex;
        $.get('../view/role-add.html', null, function (form) {
            boxIndex = layer.open({
                type: 1,
                title: '添加角色',
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
                    $('form.layui-form').find('button[lay-filter=addRole]').click();
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
                    //表单提交
                    form.on('submit(addRole)', function (data) {
                        handlingIndex = layer.load(2, {time: 10 * 1000});
                        _role.addRole(JSON.stringify(data.field),
                            function () {
                                layer.msg('添加角色成功');
                                layerTips.close(boxIndex);
                                layerTips.close(handlingIndex);
                                location.reload(); //刷新
                            },
                            function (errorMsg) {
                                layerTips.close(handlingIndex);
                                layer.msg('' + errorMsg);
                            });
                        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
                    });
                },
                end: function () {
                    boxIndex = -1;
                }
            });
        });
    });


    /*初始化树形菜单*/
    var setting = {
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    };
    function setCheck() {
        var zTree = $.fn.zTree.getZTreeObj("permissionTree"),
            type = {"Y": "ps", "N": "ps"};
        zTree.setting.check.chkboxType = type;
    }

});