/**
 * 当前文件版本：v0.3
 * 一款可以让div可编辑的工具
 * ============================================
 * 项目地址：
 * 作者：见两小儿便日
 * 作者地址：https://github.com/ALNY-AC
 * ============================================
 * 
 * */

var editel = (function() {

    var edit = {
        config: {
            inputClass: 'editel-input',
            endFunction: null, //编辑完成并且回到原本的div的时候调用
            startFunction: null, //编辑开始并且进入到编辑控件中调用
        },
        init: function(config) {

            if(config != null) {
                this.config = config;
            }

            $(document).on('click', '.editel', function() {

                /*
                 * 
                 * 克隆一个this，并设置可编辑
                 * 移除.editel
                 * 添加.editel-style
                 * 追加this后面
                 * this隐藏
                 * this>input获得焦点
                 * 
                 */
                var id = getRandom(11);

                $(this).attr('data-edit_id', 'edit_' + id);

                var div = $('<div/>').addClass('editel-input');
                $('body').append(div);

                div.attr('id', 'edit_' + id);

                div.text($(this).text());

                div.css('width', $(this).css('width'));
                div.css('height', $(this).css('height'));
                div.css('text-align', $(this).css('text-align'));
                div.css('display', $(this).css('display'));
                div.css('font-size', $(this).css('font-size'));

                div.attr('contenteditable', 'true');
                div.offset($(this).offset());

                div.focus();
            });

            $(document).on('blur', '.' + edit.config.inputClass, function() {
                /*
                 * 失去焦点后
                 * 选取之前的元素
                 * 设置元素文本为输入组件中的文本
                 * 让元素显示
                 */

                var id = $(this).attr('id');
                $('.editel[data-edit_id="' + id + '"]').text($(this).text());

                //====
                $(this).remove(); //删除自己    

                //如果结束回调函数存在，则调用
                var fun = edit.config.endFunction;
                if(fun != null && typeof(fun) === 'function') {
                    /**
                     * 参数：
                     * 		编辑之前的原元素
                     *      编辑之前的元素是：父元素的前一个元素
                     * 
                     * */
                    fun($('.editel[data-edit_id=' + id + ']'));
                }

            });
        },

    }
    return edit;

})();
//调用初始化函数
editel.init();

function getRandom(length) {

    var str = '';

    for(var i = 1; i <= length; i++) {
        str += String.fromCharCode(97 + parseInt(Math.random() * 25));
    }
    var time = '' + new Date().getTime();

    time = time.substr(time.length - 5, time.length);

    return str + time;

}