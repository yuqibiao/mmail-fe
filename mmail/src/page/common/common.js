/**
 * Created by yu
 * on 2017/12/29.
 */
'use strict';

require('./common.css');
require('node_modules/font-awesome/css/font-awesome.min.css');
require('./footer/footer.css');
require('./header/header.css');

/*引入另外一个js文件 util-->/src/utils
别名在webpack.config文件中配置*/
var _mm     = require('util/mm.js');
function test() {
    console.log("========common.js===");
    _mm.errorTips("common.js");
}
