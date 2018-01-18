/** navbar.js By Beginner Emain:zheng_jinfan@126.com HomePage:http://www.zhengjinfan.cn */
layui.define(['element', 'common'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        element = layui.element(),
        common = layui.common,
        cacheName = 'tb_navbar';

    var Navbar = function () {
		/**
		 *  默认配置 
		 */
        this.config = {
            elem: undefined, //容器
            data: undefined, //数据源
            url: undefined, //数据源地址
            type: 'GET', //读取方式
            cached: false, //是否使用缓存
            spreadOne: false //设置是否只展开一个二级菜单
        };
        this.v = '1.0.0';
    };
    //渲染
    Navbar.prototype.render = function () {
        var _that = this;
        var _config = _that.config;
        if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
            common.throwError('Navbar error: elem参数未定义或设置出错，具体设置格式请参考文档API.');
        }
        var $container;
        if (typeof (_config.elem) === 'string') {
            $container = $('' + _config.elem + '');
        }
        if (typeof (_config.elem) === 'object') {
            $container = _config.elem;
        }
        if ($container.length === 0) {
            common.throwError('Navbar error:找不到elem参数配置的容器，请检查.');
        }
        if (_config.data === undefined && _config.url === undefined) {
            common.throwError('Navbar error:请为Navbar配置数据源.')
        }
        if (_config.data !== undefined && typeof (_config.data) === 'object') {
            var html = getHtml(_config.data);
            $container.html(html);
            element.init();
            _that.config.elem = $container;
        } else {
            if (_config.cached) {
                var cacheNavbar = layui.data(cacheName);
                if (cacheNavbar.navbar === undefined) {
                    $.ajax({
                        type: _config.type,
                        url: _config.url,
                        async: false, //_config.async,
                        dataType: 'json',
                        success: function (result, status, xhr) {
                            //添加缓存
                            layui.data(cacheName, {
                                key: 'navbar',
                                value: result
                            });
                            var html = getHtml(result);
                            $container.html(html);
                            element.init();
                        },
                        error: function (xhr, status, error) {
                            common.msgError('Navbar error:' + error);
                        },
                        complete: function (xhr, status) {
                            _that.config.elem = $container;
                        }
                    });
                } else {
                    var html = getHtml(cacheNavbar.navbar);
                    $container.html(html);
                    element.init();
                    _that.config.elem = $container;
                }
            } else {
                //清空缓存
                layui.data(cacheName, null);
                $.ajax({
                    type: _config.type,
                    url: _config.url,
                    async: false, //_config.async,
                    dataType: 'json',
                    success: function (result, status, xhr) {
                        var html = getHtml(result);
                        $container.html(html);
                        element.init();
                    },
                    error: function (xhr, status, error) {
                        common.msgError('Navbar error:' + error);
                    },
                    complete: function (xhr, status) {
                        _that.config.elem = $container;
                    }
                });
            }
        }

        //只展开一个二级菜单
        if (_config.spreadOne) {
            var $ul = $container.children('ul');
            $ul.find('li.layui-nav-item').each(function () {
                $(this).on('click', function () {
                    $(this).siblings().removeClass('layui-nav-itemed');
                });
            });
        }
        return _that;
    };
	/**
	 * 配置Navbar
	 * @param {Object} options
	 */
    Navbar.prototype.set = function (options) {
        var that = this;
        that.config.data = undefined;
        $.extend(true, that.config, options);
        return that;
    };
	/**
	 * 绑定事件
	 * @param {String} events
	 * @param {Function} callback
	 */
    Navbar.prototype.on = function (events, callback) {
        var that = this;
        var _con = that.config.elem;
        if (typeof (events) !== 'string') {
            common.throwError('Navbar error:事件名配置出错，请参考API文档.');
        }
        var lIndex = events.indexOf('(');
        var eventName = events.substr(0, lIndex);
        var filter = events.substring(lIndex + 1, events.indexOf(')'));
        if (eventName === 'click') {
            if (_con.attr('lay-filter') !== undefined) {
                _con.children('ul').find('li').each(function () {
                    var $this = $(this);
                    if ($this.find('dl').length > 0) {
                        var $dd = $this.find('dd').each(function () {
                            $(this).on('click', function () {
                                var $a = $(this).children('a');
                                var menuObj = $a.data("menuObj")
                                var href = menuObj.href;
                                var icon = menuObj.icon;
                                var title =menuObj.title;
                                var data = {
                                    elem: $a,
                                    field: {
                                        href: href,
                                        icon: icon,
                                        title: title
                                    }
                                };
                                clickMenu($a);
                                if (!menuObj.isParent){
                                    callback(data);
                                }
                            });
                        });
                    } else {
                        $this.on('click', function () {
                            var $a = $this.children('a');
                            var href = $a.data('url');
                            var icon = $a.children('i:first').data('icon');
                            var title = $a.children('cite').text();
                            var data = {
                                elem: $a,
                                field: {
                                    href: href,
                                    icon: icon,
                                    title: title
                                }
                            }
                            callback(data);
                        });
                    }
                });
            }
        }
    };
	/**
	 * 清除缓存
	 */
    Navbar.prototype.cleanCached = function () {
        layui.data(cacheName, null);
    };
	/**
	 * 获取html字符串
	 * @param {Object} data
	 */
    function getHtml(data) {
        return initLeftMenu(data);
    }

    var navbar = new Navbar();

    exports('navbar', function (options) {
        return navbar.set(options);
    });


    /**
     * 设置左侧菜单数据
     */
    var menuData;
    function initLeftMenu(data){
        menuData = data;
        return initMenu();
    }


    /**
     * 初始化首节点菜单
     *
     */
    function initMenu() {
        var parentMenus = getMenusByParentId("");
        var $menu = $("#menu");
        for(var i = 0 ; i< parentMenus.length ; i++){
            var item = parentMenus[i];
            var $li = $('<li class="layui-nav-item">');
            var $a = $('<a href="javascript:;" data-url="' + item.href + '">');
            //hover($a);
            $a.data("menuObj", item);
            if(item.icon!==undefined && item.icon!==''){
                if (item.icon.indexOf('fa-')!==-1){
                    $a.append('<i  class="fa ' + item.icon  + '" >' + '</i>');
                }else{
                    $a.append('<i class="layui-icon" >' +item.icon + '</i>');
                }
            }
            var $title = $('<cite>' + item.title + '</cite>');
            $a.append($title);
            $li.append($a);
            $menu.append($li);
            if(item.isParent){
                var $span = $('<span class="layui-nav-more"></span>');
                $a.append( $span);
                var childMenus = getMenusByParentId(item.id);
                initChildMenu(childMenus ,$a);
            }
        }
        return $menu.innerHTML;
    }


    /**
     * 初始化子菜单
     *
     * @param childMenus
     * @param a
     */
    function initChildMenu(childMenus , a) {
        var $span = $('<span class="layui-nav-down"></span>');
        for (var i = 0 ; i<childMenus.length ; i++){
            var childItem = childMenus[i];
            var $dd = $('<dd></dd>');
            var $a = $('<a href="javascript:;" data-url="' + childItem.href + '" >' );
            //hover($a);
            var $dl = $('<dl class="layui-nav-child">');
            $a.data("menuObj", childItem);
            if(childItem.icon!==undefined && childItem.icon!==''){
                if (childItem.icon.indexOf('fa-')!==-1){
                    $a.append('<i  class="fa ' + childItem.icon  + '" >' + '</i>');
                }else{
                    $a.append('<i class="layui-icon" >' +childItem.icon + '</i>');
                }
            }
            var $title = $('<cite>' + childItem.title + '</cite>');
            $a.append($title);
            $dd.append($a);
            $dl.append($dd);
            a.parent().append($dl);
            if(childItem.open){
                $dl.addClass("layui-nav-child-show");
                a.parent().addClass("layui-nav-itemed");
            }else{
                $dl.addClass("layui-nav-child-hide");
            }
            if (childItem.isParent) {
                $a.append($span);
                var pId = childItem.id;
                var childMenus = getMenusByParentId(pId);
                initChildMenu(childMenus, $a);
            }
        }
    }


    /**
     * 得到某一父节点下的子菜单
     *
     * @param menus
     * @param parentId parentId为空时为首节点
     */
    function getMenusByParentId(pid) {
        var menus = menuData;
        var childMenus = [];
        for (var i = 0; i < menus.length; i++) {
            var itemPid = menus[i].pId;
            if (itemPid=== pid) {
                childMenus.push(menus[i]);
            }
        }
        return childMenus;
    }

    /**
     * 菜单的点击事件
     *
     * @param a
     */
    function clickMenu(a){
        //$(a).parent().toggleClass("layui-nav-itemed");
        var menuObj = $(a).data("menuObj");
        var next = (a).next();
        if($(next).hasClass("layui-nav-child-show")){
            $(next).removeClass("layui-nav-child-show");
            $(next).addClass("layui-nav-child-hide") ;
        }else{
            $(next).removeClass("layui-nav-child-hide");
            $(next).addClass("layui-nav-child-show");
        }
        var sapn = $(a).children("span");
        if ($(sapn).hasClass("layui-nav-down")) {
            $(sapn).addClass( "layui-nav-more");
        } else {
            $(sapn).addClass("layui-nav-down") ;
        }
        //点击的是菜单项
        if(!menuObj.isParent){
            //console.log("====点击菜单"+menuObj.title);
        }
    }

/*
    function hover(a){
        var navSpan = $(a).find(".layui-nav-bar");
        $(a).mouseover(function () {
            console.log("===over"+this.offsetHeight);
            navSpan.removeClass(".layui-nav-bar-show");
            navSpan.addClass("layui-nav-bar-hidden");
        });

        $(a).mouseleave(function () {
            navSpan.addClass(".layui-nav-bar-show");
            navSpan.removeClass("layui-nav-bar-hidden");
        });

    }
*/

});