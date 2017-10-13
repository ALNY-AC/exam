var paperList = (function() {

    var obj = {
        config: {
            paperEditShow: '',
            paperEditGroup: '',
            paperRemoveUrl: '',
        },

        init: function() {

            $(document).on('click', '.paper-remove', function() {
                /*
                 * 删除试卷面板
                 * 删除前需要提示用户是否真的删除
                 * 
                 * 
                 * */

                var self = $(this);

                swal({
                    title: '确定删除这个试卷？',
                    text: "这个删除不可恢复！",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '确定删除~',
                    cancelButtonText: '取消'

                }).then(function() {

                    //  ========== 
                    //  = AJAX提交删除请求，后台处理数据库，删除成功后返回状态 = 
                    //  ========== 

                    var paperID = self.parents('.paper-panel').attr('id');

                    $.post(obj.config.paperRemoveUrl, {
                        paper_id: paperID
                    }, function(o) {

                        var oj = JSON.parse(o);

                        if(oj.code == '1') {
                            self.parents('.paper-panel').remove();
                            swal(
                                '删除!',
                                '删除成功~后悔也来不及了~',
                                'success'
                            );
                        } else {
                            self.parents('.paper-panel').remove();
                            swal(
                                '失败!',
                                '删除失败~好庆幸~',
                                'success'
                            );
                        }

                    })

                })

            });
            $(document).on('click', '.paper-set', function() {
                /*
                 * 设置#editPaper.val为this#id
                 * 设置标题
                 * 设置是否可视
                 * 获取分组信息，并且设置分组信息
                 * 模态可视
                 * 
                 */

                var parents = $(this).parents('.paper-panel'); //父

                //  ========== 
                //  = 设置id = 
                //  ========== 
                $('#editPaper').val(parents.attr('id')); //设置id

                //  ========== 
                //  = 设置标题 = 
                //  ========== 
                $('#paperTitle').text(parents.find('.paper-panel-title').text()); //设置标题
                //  ========== 
                //  = 设置分享连接 = 
                $('#shareUrl').val(parents.find('.paper-look').attr('href')); //设置标题

                //  ========== 

                //  ========== 
                //  = 分组 = 
                //  ========== 
                //              
                /*
                 * 
                 * ajax请求当前id的分组信息，并请求所有存在的分组
                 * 设置#groupSelect>#dropdownMenu1的text为当前分组信息的title
                 * 之后遍历插入所有分组
                 * 
                 */

                $.post(paperList.config.paperEditGroup, {
                    type: 'get'
                }, function(o) {

                    var oj = $.parseJSON(o);

                    if(oj.code == '1') {

                        $('#groupSelect').empty();
                        $('#groupSelect').append('<option value="">请选择</option>'); //遍历插入
                        $('#groupSelect').append('<option value="0">默认分组</option>'); //遍历插入

                        for(x in oj.item) {

                            var option = $('<option/>').val(oj.item[x].group_id);
                            option.text(oj.item[x].title);

                            $('#groupSelect').append(option); //遍历插入

                        }

                    } else {
                        //失败
                        prompt.show({
                            text: '请求分组失败~',
                            style: 'danger',
                            position: 'bottom'
                        });

                    }

                });

                //  ========== 
                //  = 设置开关状态 = 
                //  ========== 

                parents.hasClass('paper-panel-show') ? honeySwitch.showOn("#isshow") : honeySwitch.showOff("#isshow");

                $('#myModal').modal('show');

            });

            $(document).on('click', '.upShow', function() {
                /*
                 * 
                 * 
                 * 点击显示
                 * 判断当前状态
                 * 调用update函数，在此函数内做ajax处理
                 * 
                 */

                var isshow = $(this).parents('.paper-panel').hasClass('paper-panel-show'); //如果有则返回true，即正在显示，否则反之

                /*
                 * 更新状态
                 */
                obj.update($(this).parents('.paper-panel').attr('id'), !isshow, true);

                $(this).tooltip('hide');

            });

        },

        add: function(infoJson) {
            /*
             * 
             * 传入题组信息的json
             * 
             */

            $('#paperPanelList').append(getPaperPanelBuild(infoJson));

            obj.update(infoJson.paper_id, infoJson.is_show == '1' ? true : false, false);

        },
        /*
         * 参数：
         *      id
         *          想要改变状态的id
         *      isshow
         *          想要改变的状态
         *      isAJAX
         *          是否进行ajax处理，如果true则对数据库进行修改，否则不提交到数据库
         * 
         */
        update: function(id, isshow, isAJAX) {
            //  ========== 
            //  = AJAX请求 = 
            //  ========== 

            var $id = '#' + id;

            if(isshow || isshow === '1') {
                //如果显示

                //更新显示状态类
                $($id).removeClass('paper-panel-noshow');
                $($id).addClass('paper-panel-show');

                //更新提示文本类
                $($id).find('.upShow').attr('data-original-title', '点击隐藏');

                //更新显示icon类
                $($id).find('.upShow>span').removeClass('glyphicon glyphicon-eye-close');
                $($id).find('.upShow>span').addClass('glyphicon glyphicon-eye-open');

            } else {
                //如果不显示

                //更新显示状态类
                $($id).removeClass('paper-panel-show');
                $($id).addClass('paper-panel-noshow');

                //更新提示文本类
                $($id).find('.upShow').attr('data-original-title', '点击显示');

                //更新显示icon类
                $($id).find('.upShow>span').removeClass('glyphicon glyphicon-eye-open');
                $($id).find('.upShow>span').addClass('glyphicon glyphicon-eye-close');

            }

            if(isAJAX) {
                //  ========== 
                //  = AJAX = 
                //  ========== 
                /*
                 * 
                 * 提交到后台，后台需要处理显示状态
                 * 提交的数据:
                 * {
                 *     id:需要修改状态的试卷id
                 *     isshow:需要的状态
                 * 
                 * }
                 * 
                 */

                $.post(obj.config.paperEditShow, {
                    paper_id: id,
                    is_show: isshow ? '1' : '0'
                }, function(o) {

                    console.log(o);
                    return;

                    var oj = $.parseJSON(o);

                    if(oj.code == '1') {
                        //成功
                        prompt.show({
                            text: '操作成功~',
                            position: 'bottom'
                        });

                    } else {
                        //失败
                        prompt.show({
                            text: '操作失败~',
                            style: 'danger',
                            position: 'bottom'
                        });

                    }

                })

            }

        }

    };

    function getPaperPanelBuild(infoJson) {
        //获得试卷面板

        var id = infoJson.paper_id,
            isshow = infoJson.is_show,
            href = infoJson.href,
            title = infoJson.paper_title,
            lookhref = infoJson.lookhref;

        var paperPanel = getPaperPanel();

        paperPanel.find('.paper-panel-title').text(title);
        paperPanel.find('.paper-panel-title').attr('href', href);
        paperPanel.find('.paper-panel-title').attr('target', '_blank');
        paperPanel.find('.paper-look').attr('data-href', lookhref);

        return paperPanel.attr('id', id);

    }

    function getPaperPanel() {
        //获得paper容器

        var head = getPaperPanelHead(); //获得面板头
        var body = getPaperPanelBody(); //获得面板体
        var bottom = getPaperPanelBottom(); //获得面板底部

        return $('<li/>').addClass('paper-panel').append(head).append(body).append(bottom);

    }

    function getPaperPanelHead() {
        //获得面板头

        var a = $('<a/>', {
            'class': 'paper-panel-tool upShow',
            'href': '#',
            'data-toggle': 'tooltip',
            'data-original-title': '点击隐藏',
            'data-placement': "left"
        });
        var span = $('<span/>', {
            'class': '',
        });
        return $('<div/>').addClass('paper-panel-head').append(a.append(span));

    }

    function getPaperPanelBody() {
        //获得面板体

        var a = $('<a/>', {
            'class': 'paper-panel-title',
        });

        return $('<div/>').addClass('paper-panel-body').append(a);
    }

    function getPaperPanelBottom() {
        //获得面板底部

        var a1 = $('<a/>', {
            'class': 'paper-panel-tool paper-set',
            'href': 'javascript:;',
            'data-toggle': 'tooltip',
            'data-original-title': '设置',
            'data-placement': "bottom"
        }).append($('<span/>').addClass('glyphicon glyphicon-cog'));
        var a2 = $('<a/>', {
            'class': 'paper-panel-tool paper-remove',
            'href': 'javascript:;',
            'data-toggle': 'tooltip',
            'data-original-title': '删除',
            'data-placement': "bottom"
        }).append($('<span/>').addClass('glyphicon glyphicon-trash'));
        var a3 = $('<a/>', {
            'class': 'paper-panel-tool paper-look',
            'href': 'javascript:;',
            'data-toggle': 'tooltip',
            'data-original-title': '预览',
            'data-placement': "bottom"
        }).append($('<span/>').addClass('glyphicon glyphicon-new-window'));

        return $('<div/>').addClass('paper-panel-bottom').append(a1).append(a2).append(a3);

    }

    return obj;

})();
paperList.init();