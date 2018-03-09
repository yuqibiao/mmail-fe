/**
 * Created by yu
 * on 2017/11/6.
 */
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