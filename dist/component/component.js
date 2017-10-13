var component = {
    url: '',
    load: function() {
        //==========================================
        /*
         * 动态添加组件
         * 
         */
        $('#nav').load('../component/' + component.url + '?id=' + Math.random(), function() {

            var filename = location.href;
            filename = filename.substr(filename.lastIndexOf('/') + 1); //当前文件名
            var name = filename.split('?')[0];

            $('a[href="' + name + '"]').parent('li').addClass('active');

        });
    }

}