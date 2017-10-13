/**
 * 当前文件版本：v0.1
 * 消息提示js库
 * ============================================
 * 项目地址：https://github.com/ALNY-AC/Prompt
 * 作者：见两小儿便日
 * 作者地址：https://github.com/ALNY-AC
 * ============================================
 * 
 * */

var prompt = (function() {

    var obj = {

        show: function(infoJson) {
            this.hide();

            var position = infoJson.position != null ? 'prompt-' + infoJson.position : 'prompt-middle';
            var style = infoJson.style != null ? 'prompt-' + infoJson.style : '';

            var em = $('<div/>').addClass('prompt ' + position + ' ' + style).text(infoJson.text);

            $('body').append(em);

            setTimeout(function() {
                em.addClass('prompt-show');
                setTimeout(function() {
                    em.removeClass('prompt-show');
                    setTimeout(function() {
                        em.remove();
                    }, 1000);

                }, 1000);

            }, 0);

            if(infoJson.endFun != null) {
                infoJson.endFun();
            }

        },
        hide: function() {
            $('.prompt').remove();
        }

    }
    return obj;

})();