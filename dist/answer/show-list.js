var showList = (function() {
    var obj = {

        add: function(paperInfo) {

            $('#listBox').append(getListPanel(paperInfo));

        }

    }

    function getListPanel(paperInfo) {

        var col = $('<div/>').addClass('col-md-3'); //栅格
        var listPanel = $('<div/>').addClass('list-panel').attr('id', paperInfo.id); //面板
        var a = $('<a/>').attr('href', paperInfo.answer_url); //点击跳转

        var head = $('<div/>').addClass('list-panel-head');
        var body = $('<div/>').addClass('list-panel-body');
        var footer = $('<div/>').addClass('list-panel-footer text-right');

        var title = $('<p/>').addClass('title').text(paperInfo.title); //标题
        var info = $('<p/>').addClass('info').text(paperInfo.info); //描述

        var fraction = $('<p/>').addClass('fraction').text(paperInfo.answer_fraction + '分'); //分数

        var img = $('<img/>').attr('src', '../../../image/bc3.jpg'); //图片

        //======================================

        head.append(img);

        body.append(title);
        body.append(info);

        footer.append(fraction);

        //======================================

        a.append(head);
        a.append(body);
        a.append(footer);

        //======================================

        listPanel.append(a);

        //======================================

        col.append(listPanel);

        return col;

    }

    return obj;

})();