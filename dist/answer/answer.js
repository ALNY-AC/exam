var answer = (function() {

    var obj = {

        config: {

            getTimeUrl: '',
            postServerUrl: '',
        },

        init: function() {

        },
        add: function(info) {
            console.log(info);

            $('#paperTitle').text(info.paperInfo.title);
            $('#paperInfo').text(info.paperInfo.info);

            for(x in info.topics) {

                $('#answerTopicBox').append(getTopicPanel(info.topics[x]));
            }
            obj.sort();

        },
        update: function(info) {
            /*
             * 根据参数更新选项状态
             * 
             * 一次性将整个数组传入
             * info是题目数组
             */

            for(x in info) {
                if(info[x].type !== 'text') {

                    for(y in info[x].content) {

                        checked = info[x].content[y].checked;

                        if(checked) {
                            var id = info[x].content[y].id;
                            $('#' + id).attr('checked', 'checked');
                        }

                    }

                } else {
                    var id = info[x].id;
                    $('#' + id).find('.content-text').html(info[x].answer);
                }

            }

        },
        sort: function() {
            //排序

            $('.answer-topic-panel').each(function(index1, el1) {
                /*
                 * 设置题号
                 * 设置选项name
                 * 设置解答题输入组件id和按钮id
                 */

                $(this).find('.answer-topic-num').html((index1 + 1) + '.&nbsp;&nbsp;');
                var type = $(this).find('.answer-topic-panel-content').attr('data-type');

                //单选组件的name属性
                $(this).find('input[type="radio"]').attr('name', 'radio_' + (index1 + 1));

                //复选组件的name属性
                $(this).find('input[type="checkbox"]').each(function(index2, el2) {
                    $(this).attr('name', 'checkbox_' + (index1 + 1) + "_" + (index2 + 1));
                })

                $(this).find('.content-text').attr('id', 'contentText' + (index1 + 1));
                $(this).find('.update').attr('data-content-id', 'contentText' + (index1 + 1));
            })

        },

        getJson: function() {
            /*
             * 获取答题的json数据
             */

            var answerJson = {};
            answerJson.paperInfo = {};

            answerJson.paperInfo.title = $('#paperTitle').text();
            answerJson.paperInfo.info = $('#paperInfo').text();

            answerJson.topics = [];

            $('.answer-topic-panel').each(function(index1, el1) {

                var topic = {};

                var type = $(this).find('.answer-topic-panel-content').attr('data-type');
                var tioicTitle = $(this).find('.title').text();
                topic.type = type;
                topic.title = tioicTitle;
                topic.id = $(this).attr('id');

                var content;

                if(type !== 'text') {

                    content = [];

                    $(this).find('.answer-topic-panel-content label').each(function(index2, el2) {
                        content[index2] = {};
                        content[index2].checked = $(this).find('input').is(':checked');
                        content[index2].id = $(this).find('input').attr('id');
                        content[index2].title = $(this).find('.input-title').text();
                    });

                } else {

                    content = $(this).find('.info-content').html(); //题目描述内容
                    topic.answer = $(this).find('.content-text').html(); //回答内容

                }

                topic.content = content;
                answerJson.topics[index1] = topic;

            });

            return answerJson;

        },
        getJsonText: function() {

            return JSON.stringify(obj.getJson().topics); //将json对象转换成json对符串 
        },
        getPeopleInfo: function() {

            var peopleInfo = {};
            peopleInfo.peopleName = $('#peopleName').text();
            peopleInfo.peopleInfo = $('#peopleInfo').text();

            return JSON.stringify(peopleInfo); //将json对象转换成json对符串 

        },
        save: function() {

            /*
             * 保存在本地的操作
             */

            var paper_id = $('#paperID').val();
            localStorage[paper_id + '_saveAnswerLocal'] = obj.getJsonText();
            localStorage[paper_id + '_savePeopleInfo'] = obj.getPeopleInfo();

        },
        removelocal: function() {

            /*
             * 移除本地记录
             */
            var paper_id = $('#paperID').val();

            localStorage.removeItem(paper_id + '_saveAnswerLocal');
            localStorage.removeItem(paper_id + '_savePeopleInfo');

        },
        postServer: function() {

            /*
             * 
             * 先在本地保存。
             * 提交给服务器
             * 获取当前试卷的id
             * 获取当前试卷的内容
             * ajax上传
             * 服务器处理完成后，返回状态。
             * 如果成功就删除本地记录，否则不删除
             * 
             * 
             */
            //          obj.save();

            $.post(obj.config.postServerUrl, {
                'paper_id': $('#paperID').val(),
                'answer_content': obj.getJsonText(), //用户回答内容
                'people_info': obj.getPeopleInfo() //用户信息
            }, function(o) {

                var oj = $.parseJSON(o);

                if(oj.code == '-1') {
                    //未登录
                    window.location.href = oj.loginUrl;
                    return;
                }

                if(oj.code == '1') {
                    //上传成功
                    prompt.show({
                        text: '同步成功~',
                        position: 'bottom'
                    });
                    obj.removelocal();
                } else {
                    //上传失败
                    prompt.show({
                        text: '同步失败~',
                        style: 'danger',
                        position: 'bottom'
                    });

                }
            });

        }

    }

    function getTopicPanel(infoJson) {
        //获取题目面板

        var panel = $('<div/>').addClass('answer-topic-panel');
        panel.attr('id', infoJson.id);

        var title = getTopicTitle(infoJson.title);
        var topicContent = getTopicContent(infoJson.type, infoJson.content, infoJson.answer);

        return panel.append(title).append(topicContent);

    }

    function getTopicTitle(title) {
        //获取题目标题组件
        var titleEm = $('<div/>').addClass('answer-topic-panel-title');
        //===
        var span1 = $('<span/>').addClass('answer-topic-num').text('1.');
        var span2 = $('<span/>').addClass('title').text(title);

        return titleEm.append(span1).append(span2);

    }

    function getTopicContent(type, content, answer) {
        //获取题目内容组件

        var contetnBox = $('<div/>').addClass('answer-topic-panel-content').attr('data-type', type);

        if(type !== 'text') {

            for(x in content) {
                var item = content[x];

                var box = $('<div/>').addClass(type);
                var label = $('<label/>');
                var input = $('<input/>').attr('type', type).attr('id', content[x].id);
                var inputTitle = $('<span/>').text(item.title).addClass('input-title');

                if(item.checked) {
                    input.attr('checked', 'checked');
                }

                box.append(label);
                label.append(input);
                label.append(inputTitle);
                //                   
                contetnBox.append(box);

            }

        } else {

            var infoBox = $('<div/>').addClass('answer-topic-info');
            var infoMuted = $('<div/>').addClass('text-muted').text('题目信息：');
            var infoContent = $('<div/>').addClass('info-content');

            infoContent.html(content);

            infoBox.append(infoMuted).append(infoContent);

            //=================

            var contentText = $('<div/>').addClass('content-text').attr('placeholder', '点击编辑按钮开始回答');
            //answer
            contentText.html(answer);

            //=================
            var edit = $('<button/>')
                .addClass('btn btn-default update edit')
                .attr('type', 'button')
                .text('编辑');

            var toolBox = $('<div/>').addClass('answer-tool text-right');

            toolBox.append(edit)

            //=================

            contetnBox
                .append(infoBox)
                .append(contentText)
                .append(toolBox);
        }

        return contetnBox;

    }

    return obj;

})();