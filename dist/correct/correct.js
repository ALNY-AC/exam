var correct = (function() {

    var obj = {

        config: {
            minID: '',
            maxID: '',
            posturl: '',
        },
        topics: [],
        answer: [],
        average: function() {
            /*
             * 计算平均分
             */

            if(obj.peopleCount() == 0) {
                return 0;
            }
            return obj.sum() / obj.peopleCount();

        },
        peopleCount: function() {
            return $('.correct-item').length;
        },
        sum: function() {
            var sum = 0;
            $('.correct-item').each(function() {
                var n = $(this).find('.answer-fraction').text();
                n = parseInt(n);
                sum += n;
            });
            return sum
        },
        max: function() {

            var max = 0;
            $('.correct-item').each(function() {

                var n = $(this).find('.answer-fraction').text();
                n = parseInt(n);

                if(n > max) {
                    max = n;
                    obj.config.maxID = $(this).attr('id');
                }

            });
            return max;

        },
        min: function() {

            var min;
            $('.correct-item').each(function(index) {

                var n = $(this).find('.answer-fraction').text();
                n = parseInt(n);

                if(index == 0) {
                    min = n;
                    obj.config.minID = $(this).attr('id');
                }

                if(min > n) {
                    min = n;
                    obj.config.minID = $(this).attr('id');
                }

            });
            return min;

        },
        addContent: function(paperJson) {

            //      fraction
            for(x in paperJson.topics) {
                var box = getTopicBox(paperJson.topics[x]);
                $('.correct-left').append(box);
            }
            obj.topics = paperJson.topics;
        },
        addAnswer: function(topics) {
            var isanswer = true;
            for(x in topics) {
                var box = getTopicBox(topics[x], isanswer);
                box.append(getBottom());
                $('.correct-right').append(box);
            }
            obj.answer = topics;
        },
        autoCorrect: function() {
            /*
             * 自动批改，会比对原题和答题，然后设置题目状态。
             */
            if(obj.answer == null || obj.answer.length == 0) {
                return;
            }
            var paper_content = obj.topics;
            var answer_content = obj.answer;
            console.log('========================')

            for(x in paper_content) {
                var a1 = paper_content[x];
                var a2 = answer_content[x];

                if(a1.type != 'text') {

                    var isTrueCount = 0;
                    var isTrueCount2 = 0;

                    for(y in a1.content) {

                        if(a1.content[y].checked) {
                            isTrueCount++;
                            if(a1.content[y].checked === a2.content[y].checked) {
                                isTrueCount2++;
                            }
                        }

                    }
                    if(isTrueCount !== 0) {
                        if(isTrueCount === isTrueCount2) {
                            $('.topic-box[data-id="' + a1.id + '"]').attr('data-is', 'true');

                        } else {
                            $('.topic-box[data-id="' + a1.id + '"]').attr('data-is', 'false');
                        }
                    }

                }

            }

        },
        autoLocal: function() {
            var loc = obj.getLocalJson();

            if(loc !== false) {

                for(x in loc) {
                    $('.topic-box[data-id="' + loc[x].id + '"]').attr('data-is', loc[x]['data-is']);
                }

            }
        },
        getJson: function() {

            /*
             * 只需要保存每题的对错状态
             */

            var topics = [];

            $('.correct-right .topic-box').each(function(index, el) {
                topics[index] = {};
                topics[index].id = $(this).attr('data-id');
                topics[index]['data-is'] = $(this).attr('data-is');

            });
            return topics;

        },
        getJsonText: function() {
            return JSON.stringify(obj.getJson()); //将json对象转换成json对符串 
        },
        save: function() {

            /*
             * 保存在本地的操作
             */

            localStorage['correct_' + $('#user_id').val() + '_' + $('#paper_id').val()] = obj.getJsonText();

        },
        removelocal: function() {

            localStorage.removeItem('correct_' + $('#user_id').val() + '_' + $('#paper_id').val());

        },
        getLocalJson: function() {
            var local = localStorage['correct_' + $('#user_id').val() + '_' + $('#paper_id').val()];

            if(local != null) {
                return JSON.parse(local);
            } else {
                return false;
            }
        },
        sort: function() {

            //排序

            $('.correct-right .topic-box').each(function(index1, el1) {
                $(this).find('.topic-num').html((index1 + 1) + '.&nbsp;&nbsp;&nbsp;');
            })
            $('.correct-left .topic-box').each(function(index1, el1) {
                $(this).find('.topic-num').html((index1 + 1) + '.&nbsp;&nbsp;&nbsp;');
            })

        },
        getfraction: function() {

            var fraction = 0;
            console.log(obj.topics);

            $('.correct-right .topic-box').each(function(index1, el1) {

                if($(this).attr('data-is') === 'true') {
                    fraction += parseInt(obj.topics[index1].fraction);
                    console.log(obj.topics[index1].fraction);
                }

            });
            return fraction;

        },
        postServer: function() {

            $.post(obj.config.posturl, {
                user_id: $('#user_id').val(),
                paper_id: $('#paper_id').val(),
                fraction: obj.getfraction(),
            }, function(o) {

                console.log(o);
                var oj = JSON.parse(o);

                if(oj.code == '1') {

                    prompt.show({
                        text: '提交成功 ',
                        position: 'bottom',
                        style: 'success'
                    });

                }

            });

        }

    };

    function getTopicBox(topics, isanswer) {

        var box = $('<div/>').addClass('topic-box').attr(isanswer ? 'data-id' : 'id', topics.id);

        var head = getTopicHead(topics, isanswer);
        var body = getTopicBody(topics, isanswer);

        if(!isanswer) {
            var fraction = $('<div/>').addClass('topic-fraction').text(topics.fraction + '分');
            box.append(fraction);
        }

        box.append(head);
        box.append(body);

        return box;

    }

    function getTopicHead(topics, isanswer) {
        var head = $('<div/>').addClass('topic-head');
        var num = $('<span/>').addClass('topic-num');
        var title = $('<span/>').addClass('topic-title').text(topics.title);

        head.append(num);
        head.append(title);

        return head;

    }

    function getTopicBody(topics, isanswer) {
        var type = topics.type;

        var body = $('<div/>').addClass('topic-body').attr('data-type', type);

        if(type != 'text') {

            for(x in topics.content) {
                var item = topics.content[x];

                var inputBox = $('<div/>').attr(isanswer ? 'data-id' : 'id', item.id);
                var label = $('<label/>');
                var input = $('<span/>')

                if(type === 'checkbox') {
                    input.addClass(item.checked ? 'fa fa-check-square' : 'fa fa-square-o');
                }
                if(type === 'radio') {
                    input.addClass(item.checked ? 'fa fa-dot-circle-o' : 'fa fa-circle-o');
                }

                var title = $('<span/>').addClass('title').text(item.title);

                inputBox.append(label);
                label.append(input);
                label.append(title);

                body.append(inputBox);

            }

        } else {

            var contentBox = $('<div/>').addClass('topic-content');
            var help = $('<p/>').addClass('help-block').text(isanswer ? '答案：' : '描述：');
            var content = $('<div/>').addClass('topic-text-content').html(isanswer ? topics.answer : topics.content);
            contentBox.append(help);
            contentBox.append(content);
            body.append(contentBox);
        }

        return body;

    }

    function getBottom() {

        var bottom = $('<div/>').addClass('topic-bottom');

        var btn1 = $('<button/>').addClass('btn btn-success true').attr('type', 'botton').attr('data-is', 'true').text('对');
        var btn2 = $('<button/>').addClass('btn btn-warning or').attr('type', 'botton').attr('data-is', 'or').text('半对');
        var btn3 = $('<button/>').addClass('btn btn-danger false').attr('type', 'botton').attr('data-is', 'false').text('错');
        bottom.append(btn1);
        bottom.append(btn2);
        bottom.append(btn3);

        return bottom;

    }

    return obj;

})();