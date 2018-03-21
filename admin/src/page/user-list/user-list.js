/**
 * 用户展示
 *
 * Created by yu
 * on 2018/1/19.
 */
require('./user-list.css');
require('../common/bTable.css');
var _user = require("service/user-service.js");
//var _role = require("service/role-service.js");

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
        url: '/api/user/v1/users', //数据源地址
        pageSize: 10,//页大小
        even: true,//隔行变色
        field: 'userId', //主键ID
        /*skin: 'row',*/
        checkbox: true,//是否显示多选框
        paged: true, //是否显示分页
        singleSelect: false, //只允许选择一行，checkbox为true生效
        params: {//额外的请求参数
            t: new Date().getTime()
        },
        columns: [
            { //配置数据列
                fieldName: '昵称', //显示名称
                field: 'username', //字段名
                sortable: true, //是否显示排序
            },
            {
                fieldName: '电话号码',
                field: 'phone'
            },
            {
                fieldName: '邮箱',
                field: 'email'
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
                field: 'userId',
                format: function (val, obj) {
                    var html = '<input type="button" value="角色分配" data-action="addRole" data-id="' + val + '" class="layui-btn layui-btn-mini" /> ' +
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
                    var userId = $that.data('id');
                    $that.on('click', function () {
                        switch (action) {
                            //分配角色
                            case 'addRole':
                                $.get('../view/user-add-role.html', null, function (form) {
                                    addBoxIndex = layer.open({
                                        type: 1,
                                        title: '分配角色',
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
                                            //填充角色信息数据
                                            var inflateIndex = layer.load(2, {time: 10 * 1000});
                                            _user.getAllRoleByUserId(
                                                userId,
                                                function (res) {
                                                var roleList = res;
                                                var roleCheckHtml="";
                                                $(roleList).each(function (index, item) {
                                                    if (item.checked){
                                                        roleCheckHtml+=' <input type="checkbox" checked name="'+item.roleId+'" value="'+item.roleId+'" title="'+item.name+'">';
                                                    }else{
                                                        roleCheckHtml+=' <input type="checkbox" name="'+item.roleId+'" value="'+item.roleId+'" title="'+item.name+'">';
                                                    }
                                                });
                                                $("#roleCheck").html(roleCheckHtml);
                                                    form.render();

                                                    layer.close(inflateIndex);
                                            } , 
                                                function (errorMsg) {
                                                    layer.close(inflateIndex);
                                                    layer.msg(errorMsg);
                                            });
                                            form.render();
                                            //表单提交
                                            form.on('submit(addRole)', function (data) {
                                                var roleIdList = new Array();
                                                var json = JSON.stringify(data.field)
                                                console.log("json=="+json);
                                                for (var key in data.field)
                                                {
                                                    roleIdList.push(key);
                                                }
                                                var handlingIndex = layer.load(2, {time: 10 * 1000});
                                                //---添加角色
                                                _user.addUserRoleList(userId , JSON.stringify(roleIdList),
                                                    function () {
                                                        layer.msg('角色添加成功');
                                                        layer.close(addBoxIndex);
                                                        layer.close(handlingIndex);
                                                        //location.reload(); //刷新
                                                    },
                                                    function (errorMsg) {
                                                        layerTips.close(addBoxIndex);
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
                            //---编辑用户
                            case 'edit':
                                var handlingIndex;
                                $.get('../view/user-edit.html', null, function (form) {
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
                                            $('form.layui-form').find('button[lay-filter=editUser]').click();
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
                                            _user.getUserByUserId(userId,
                                                function (res) {
                                                    var body = layer.getChildFrame('body', index);
                                                    var user = res;
                                                    $("#userId").val("" + user.userId);
                                                    $("#username").val("" + user.username);
                                                    $("#phone").val("" + user.phone);
                                                    $("#email").val("" + user.email);
                                                    $("#userId").val("" + user.userId);
                                                    var statusVal = user.status;
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
                                            //表单验证
                                            form.verify({
                                                username: function (value, item) { //value：表单的值、item：表单的DOM对象
                                                    if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                                                        return '用户名不能有特殊字符';
                                                    }
                                                    if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                                                        return '用户名首尾不能出现下划线\'_\'';
                                                    }
                                                    if (/^\d+\d+\d$/.test(value)) {
                                                        return '用户名不能全为数字';
                                                    }
                                                }
                                                //我们既支持上述函数式的方式，也支持下述数组的形式
                                                //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
                                                , password: [
                                                    /^[\S]{6,18}$/
                                                    , '密码必须6到18位，且不能出现空格'
                                                ]
                                            });
                                            //表单提交
                                            form.on('submit(editUser)', function (data) {
                                                handlingIndex = layer.load(2, {time: 10 * 1000});
                                                _user.updateUser(JSON.stringify(data.field),
                                                    function () {
                                                        layer.msg("用户信息修改成功");
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
                                var username = $that.parent('td').siblings('td[data-field=username]').text();
                                layer.confirm('确定要删除[ <span style="color:red;">' + username + '</span> ] ?', {icon: 3, title: '操作提示'}, function (index) {
                                    //删除用户操作
                                    var handlingIndex = layer.load(2, {time: 10 * 1000});
                                    _user.deleteUserById(userId,
                                        function () {
                                            layer.msg('成功删除 '+username);
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
            //layer.msg("选中的Id有：" + data.ids);
            var count = data.count;
            var ids = data.ids;
            layer.confirm('确定要删除选中的  <span style="color:red; font-size: 13px">' + count + '</span>  条数据?', {icon: 3, title: '操作提示'}, function (index) {
                var handlingIndex = layer.load(2, {time: 10 * 1000});
                _user.deleteUserByIdList(JSON.stringify(ids),
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
        $.get('../view/user-add.html', null, function (form) {
            addBoxIndex = layer.open({
                type: 1,
                title: '添加用户',
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
                    $('form.layui-form').find('button[lay-filter=addUser]').click();
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

                    //表单验证
                    form.verify({
                        username: function (value, item) { //value：表单的值、item：表单的DOM对象
                            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                                return '用户名不能有特殊字符';
                            }
                            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                                return '用户名首尾不能出现下划线\'_\'';
                            }
                            if (/^\d+\d+\d$/.test(value)) {
                                return '用户名不能全为数字';
                            }
                        }
                        //我们既支持上述函数式的方式，也支持下述数组的形式
                        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
                        , password: [
                            /^[\S]{6,18}$/
                            , '密码必须6到18位，且不能出现空格'
                        ]
                    });
                    //表单提交
                    form.on('submit(addUser)', function (data) {
                        var handlingIndex = layer.load(2, {time: 10 * 1000});
                        _user.addUser(JSON.stringify(data.field),
                            function () {
                                layer.msg('添加用户成功');
                                layerTips.close(addBoxIndex);
                                layer.close(handlingIndex);
                                location.reload(); //刷新
                            },
                            function (errorMsg) {
                                layerTips.close(addBoxIndex);
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

});