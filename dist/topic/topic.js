//checkbox radio text

//=================================

var paperBuild = (function() {

    var obj = {
        config: {
            box: null, //设置题目的容器
            getTimeUrl: '',
            postServerUrl: '',
        },
        init: function() {
            //初始化

            var eventArr = [{
                eventNmae: 'click',
                className: '.move-up',
                tag: '上移组件',
                fun: function() {

                    var paperItem = $(this).parents(".topic-item-box"); //获取顶级容器
                    var paperItemPrev = paperItem.prev(".topic-item-box"); //上一个元素

                    if(paperItemPrev[0] !== undefined) { //如果上一个元素不为空
                        paperItemPrev.before(paperItem); //插入到前元素之前
                        obj.sort(); //排序
                        prompt.show({
                            text: '上移成功~',
                        });
                    } else {
                        //如果上面没有元素了
                        console.log('上面没了');
                        prompt.show({
                            text: '上面没了~',
                        });
                    }

                }
            }, {
                eventNmae: 'click',
                className: '.move-down',
                tag: '下移组件',
                fun: function() {
                    var paperItem = $(this).parents(".topic-item-box"); //获取顶级容器
                    var paperItemNext = paperItem.next(".topic-item-box"); //获取顶级容器

                    if(paperItemNext[0] !== undefined) { //如果下一个元素不为空
                        paperItemNext.after(paperItem); //插入到后元素之后
                        obj.sort(); //排序
                        prompt.show({
                            text: '下移成功~',

                        });
                    } else {
                        //如果下面没有元素了
                        prompt.show({
                            text: '下面没了~',
                        });
                    }
                }
            }, {
                eventNmae: 'click',
                className: '.move-clone',
                tag: '克隆组件',
                fun: function() {

                    //在自己之后追加自己的克隆对象
                    var paperItem = $(this).parents(".topic-item-box"); //获取顶级容器
                    paperItem.after(paperItem.clone());
                    obj.sort(); //排序
                    prompt.show({
                        text: '复制成功~',
                    });
                }
            }, {
                eventNmae: 'click',
                className: '.move-delete',
                tag: '删除组件',
                fun: function() {

                    $(this).parents(".topic-item-box").remove();
                    obj.sort();
                    prompt.show({
                        text: '删除成功~',
                        style: 'danger'
                    });
                }
            }, {
                eventNmae: 'click',
                className: '.add-topic-item',
                tag: '添加选项组件',
                fun: function() {

                    var p = $(this).parents(".topic-item-box"); //获取顶级父容器
                    var num = p.find('.topic-item').length; //获取已经有的.topic-item数量
                    var type = p.find('.topic-content').attr('data-topic-type'); //获取题目类型
                    var endTopicItem = p.find('.topic-item').last(); //获取最后一个.topic-item
                    var topicItem = getTopicItem(type); //获得一个.topicItem

                    //将.topic-item追加到最后
                    endTopicItem.after(topicItem);

                    //排序
                    obj.sort();
                }
            }];

            for(x in eventArr) {
                $(document).on(eventArr[x].eventNmae, eventArr[x].className, eventArr[x].fun);
            }

            obj.sort();
        },
        sort: function() {
            //排序
            $(".topic-item-box").each(function(index1, element1) {
                //组件id
                //              $(this).attr('id', 'paperItem' + (index1 + 1));
                //组件题号
                $(this).find('.topic-menu-num').text('Q' + (index1 + 1));
                //编辑组件的id属性，用于编辑
                //              $(this).find('.openEdit').attr('data-item-id', '#paperItem' + (index1 + 1));
                //单选组件的name属性
                $(this).find('input[type="radio"]').attr('name', 'radio_' + (index1 + 1));
                //复选组件的name属性
                $(this).find('input[type="checkbox"]').each(function(index2, element2) {
                    $(this).attr('name', 'checkbox_' + (index1 + 1) + "_" + (index2 + 1));
                })

            });
        },
        getJson: function() {
            //返回json格式的数据
            /**
             * 获得试卷的标题
             * 获得试卷的简介
             * */
            var paperTitle = $('#paperTitle').html();
            var paperInfo = $('#paperInfo').html();
            var topicJson = {}; //记录试卷信息的json

            topicJson.paperInfo = {}; //试卷信息
            topicJson.paperInfo.title = paperTitle; //试卷titie
            topicJson.paperInfo.info = paperInfo; //试卷简介
            topicJson.topics = []; //题目数组

            $(".topic-item-box").each(function(index1, element) {

                /**
                 * 获取题目的标题
                 * 获取题目的类别
                 * 获取题目的内容
                 * 
                 * */
                var itemTitle = $(this).find('.topic-title .editel').text(); //题目标题
                var type = $(this).find('.topic-content').attr('data-topic-type'); //题目类别

                topicJson.topics[index1] = {};
                topicJson.topics[index1].type = type;
                topicJson.topics[index1].title = itemTitle;
                topicJson.topics[index1].id = $(this).attr('id');
                topicJson.topics[index1].fraction = $(this).find('.fraction').val();

                var content;

                if(type !== 'text') {
                    content = [];

                    $(this).find('.topic-item').each(function(index2, element) {

                        content[index2] = {};
                        content[index2].checked = $(this).find('.topic-input input').is(':checked');
                        content[index2].id = $(this).find('.topic-input input').attr('id');
                        content[index2].title = $(this).find('.topic-item-title .editel').text();

                    });

                } else {

                    content = $(this).find('.topic-text').html();

                }
                topicJson.topics[index1].content = content;
            });
            return topicJson;
        },

        getJsonText: function() {
            //获取string格式的json
            return JSON.stringify(obj.getJson()); //将json对象转换成json对符串 
        },
        getAnswerJson: function() {
            /*
             * 获得答题json，不包含答案的
             */
            var paperJson = obj.getJson();

            for(x in paperJson.topics) {

                if(paperJson.topics[x].type !== 'text') {

                    for(y in paperJson.topics[x].content) {

                        paperJson.topics[x].content[y].checked = false;

                    }

                } else {

                    paperJson.topics[x].answer = "";

                }

            }

            return paperJson;

        },
        getAnswerJsonText: function() {
            return JSON.stringify(obj.getAnswerJson());
        },
        jsonToPaper: function(paperJson) {

            var title = paperJson.paperInfo.title;
            var info = paperJson.paperInfo.info;
            $('#paperTitle').text(title);
            $('#paperInfo').text(info);

            for(x in paperJson.topics) {
                obj.add(paperJson.topics[x]);
            }

        },
        add: function(type) {
            /**
             * 如果type是string类型，则添加默认题目
             * 如果type是json（object）且不是数组，则添加单项
             * json和数组的区别通过数组独有的length来确定
             * 
             * */
            //根据类别添加题目
            if(obj.config.box != null) {
                $(obj.config.box).append(getPaperTtem(type)); //通过类别添加默认单项
                obj.sort();
            }

        },
        save: function() {
            /*
             * 保存在本地的操作
             */

            var paper_id = $('#paperID').val();

            localStorage[paper_id + '_savePaperLocal'] = obj.getJsonText();

        },
        removelocal: function() {

            /*
             * 移除本地记录
             */
            var paper_id = $('#paperID').val();

            localStorage.removeItem(paper_id + '_savePaperLocal');

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
            obj.save();

            $.post(obj.config.postServerUrl, {
                'paper_id': $('#paperID').val(),
                'paper_title': $('#paperTitle').text(),
                'paper_info': $('#paperInfo').text(),
                'paper_content': obj.getJsonText(), //原题，带答案
                'paper_answer_content': obj.getAnswerJsonText() //答题，不带答案
            }, function(o) {

                var oj = $.parseJSON(o);

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

    function getPaperTtem(obj) {
        //返回试卷题目
        return getPaperBox(obj); //题目容器
    }

    function getPaperBox(obj) {
        //返回试卷题目容器
        var liBox = $('<li/>').addClass('topic-item-box');
        var title;
        var type;
        var content;
        var paperBox = get$('div').addClass('topic-box'); //题目容器

        var paperTitle = get$('div').addClass('topic-title').append(get$('div').addClass('editel')); //题目标题
        var paperContent = get$('div').addClass('topic-content'); //题目选项内容容器

        if(typeof(obj) === 'string') {
            //通过默认的创建
            type = obj;
            liBox.attr('id', getRandom(11));
            switch(type) {
                case 'checkbox':
                    paperTitle.find('.editel').text('复选题');
                    paperContent.append(getTopicItem(type));
                    paperContent.append(getTopicItem(type));
                    paperContent.append(getTopicItem(type));
                    paperContent.append(getTopicItem(type));
                    break;
                case 'radio':
                    paperTitle.find('.editel').text('单选题');
                    paperContent.append(getTopicItem(type));
                    paperContent.append(getTopicItem(type));
                    break;
                case 'text':
                    paperTitle.find('.editel').text('解答题');
                    paperContent.append(getTopicItem(type));
                    break;
            }

        }
        if(typeof(obj) === 'object') {
            //通过已经拥有的参数创建
            title = obj.title;
            type = obj.type;
            content = obj.content;
            paperTitle.find('.editel').text(title);
            liBox.attr('id', obj.id);
            if(typeof(content) == 'string') {

                paperContent.append(getTopicItem(type, content));

            } else {
                for(x in content) {
                    paperContent.append(getTopicItem(type, content[x].title, content[x].checked, content[x].id));
                }
            }

        }

        var paperMenu = getPaperMenu(); //菜单

        var paperBottom = getPaperBottom(type, obj.fraction); //底部工具栏

        paperContent.attr('data-topic-type', type);

        return liBox.html(paperBox.append(paperMenu).append(paperTitle).append(paperContent).append(paperBottom));

    }

    function getPaperMenu() {
        //返回菜单容器
        var paperMenu = get$('div', {
            'class': 'topic-menu'
        });
        var paperNum = get$('div', {
            'class': 'topic-menu-num'
        });
        var paperMenuTool = get$('div', {
            'class': 'topic-menu-tool'
        });

        var aToolInfo = [{
            'href': 'javascript:;',
            'class': 'move-up',
            'data-mtpis': '上移',
        }, {
            'href': 'javascript:;',
            'class': 'move-down',
            'data-mtpis': '下移',
            'data-toggle': 'tooltip',
        }, {
            'href': 'javascript:;',
            'class': 'move-clone',
            'data-mtpis': '复制',
        }, {
            'href': 'javascript:;',
            'class': 'move-delete',
            'data-mtpis': '删除',
            'data-mtpis-style': 'danger',
        }, ];

        var spanInfo = [{
            'class': 'glyphicon glyphicon-chevron-up'
        }, {
            'class': 'glyphicon glyphicon-chevron-down'
        }, {
            'class': 'glyphicon glyphicon-duplicate'
        }, {
            'class': 'glyphicon glyphicon-trash'
        }, ];

        var aToolArr = [];

        for(var i = 0; i < aToolInfo.length; i++) {
            //返回a，并且在a中追加span，之后将a添加到数组中
            aToolArr[i] = get$('a', aToolInfo[i]).append(get$('span', spanInfo[i]));
            paperMenuTool.append(aToolArr[i]);
        }

        return paperMenu.append(paperNum).append(paperMenuTool);
    }

    function getTopicItem(type, title, checked, id) { //返回选项题目组件
        var TopicItem = get$('div', {
            'class': 'topic-item'
        }); //选项容器
        if(type !== 'text') {

            var TopicInput = get$('div', {
                'class': 'topic-input'
            });
            var Input = get$('input', {
                'type': type
            }).attr('id', getRandom(11));;
            var TopicTitle = get$('div', {
                'class': 'topic-item-title'
            });
            var editelDiv = get$('div', {
                'class': 'editel'
            });

            if(title != null) {
                editelDiv.text(title);
            } else {
                if(type == 'checkbox') {
                    editelDiv.text('复选项');
                }
                if(type == 'radio') {
                    editelDiv.text('单选项');
                }
            }

            if(checked != null) {
                Input.attr('id', id);
                if(checked == true) {
                    Input.attr('checked', 'checked');

                }
            }

            TopicItem
                .append(
                    TopicInput.append(Input)
                )
                .append(
                    TopicTitle.append(editelDiv)
                );

        } else {

            var topicText = get$('div').addClass('topic-text openEdit').attr('placeholder', '点击开始编辑');
            if(title != null) {
                topicText.html(title);
            }
            TopicItem.append(topicText);

        }
        return TopicItem;
    }

    function getPaperBottom(type, fraction) {

        var bottom = get$('div').addClass('topic-bottom');

        if(type !== 'text') {
            var a = get$('a', {
                'class': 'topic-bottom-item add-topic-item',
                'href': 'javascript:;',
                'data-mtpis': '添加',
            });
            a.append(get$('span', {
                'class': 'glyphicon glyphicon-plus-sign',
            }));
            bottom.append(a);

        }

        var fubox = get$('a', {
            'class': 'topic-bottom-item ',
            'href': 'javascript:;',
            'data-mtpis': '设置本题分数',
        });
        var fu = $('<input/>').addClass('fraction form-control').attr('type', 'number').val(fraction);

        fubox.append(fu);

        bottom.append(fubox);
        return bottom;
    }

    function get$(emName, attr) {
        return $('<' + emName + '/>', attr);
    }

    return obj;
})();
paperBuild.init();

function getRandom(length) {

    var str = '';

    for(var i = 1; i <= length; i++) {
        str += String.fromCharCode(97 + parseInt(Math.random() * 25));
    }
    var time = '' + new Date().getTime();

    time = time.substr(time.length - 5, time.length);

    return str + time;

}