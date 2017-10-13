var group = (function() {

    var obj = {
        config: {
            groupSortUrl: '', //修改排序分组地址
            groupAddUrl: '', //添加分组地址
            groupRemoveUrl: '', //删除分组地址
            groupEditUrl: '' //修改分组名地址

        },
        init: function() {
            $(document).on('click', '.group-item', function() {
                /*
                 * 分组点击事件
                 * 点击后从服务器取出相关分组的试卷返回
                 * 
                 * */

            });
            $(document).on('click', '.edit-group', function() {
                /*
                 * 修改分组名事件
                 * 点击后
                 * 显示编辑组件
                 * append在父.group-item
                 * 
                 * */
                var gi = $(this).parents('.group-item');
                var title = gi.find('.title');
                var input = gi.find('input');
                title.hide();
                input.val(title.text()).show().focus();

            });
            $(document).on('blur', '.group-item input', function() {
                update($(this));
            });
            $(document).on('keyup', '.group-item input', function(event) {

                if(event.keyCode == 13) {
                    update($(this));
                }

            });

            function update(em) {

                /*
                 * 当分组编辑组件失去焦点后
                 * 获取this.val
                 * ajax传给后台，后台修改数据库后返回json
                 * {
                 *     success:是否成功修改，如果不成功分组也不能修改，并且弹出提示修改失败，否则反之
                 *     title:返回修改成功后的标题
                 * }
                 * 设置a.title.text为ajax.json.title
                 * 
                 */

                var newTitle = em.val();
                var groupid = em.parents('.group-item').attr('id');

                //  ========== 
                //  = 在此输入ajax = 
                //  ========== 

                $.post(obj.config.groupEditUrl, {
                    newTitle: newTitle,
                    group_id: groupid
                }, function(o) {

                    var oj = JSON.parse(o);

                    if(oj.code == '1') {

                        em.prev('.title').text(newTitle);
                        em.prev('.title').show();
                        em.hide();

                        prompt.show({
                            text: oj.title,
                            position: 'bottom',
                        });

                    }

                })

            }

            $(document).on('click', '.remove-group', function() {
                /*
                 * 删除分组事件
                 * 点击后向服务器提交请求，服务器成功删除后返回json，内有true
                 * 
                 * */
                var self = $(this)

                swal({
                    title: '确定删除这个分组？',
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
                    var groupid = self.parents('.group-item').attr('id');

                    $.post(obj.config.groupRemoveUrl, {
                        groupID: groupid
                    }, function(o) {

                        var oj = JSON.parse(o);

                        if(oj.code == '1') {

                            self.parents('.group-item').remove();
                            swal(
                                '删除!',
                                oj.title + '~后悔也来不及了~',
                                'success'
                            )

                            console.log(self.parents('.group-item').hasClass('active'));

                            obj.sort();

                        }

                    })

                })

            });
            $(document).on('click', '#group-add', function() {
                /*添加分组*/
                $(this).hide();
                $('#group-add-input').show();
                $('#group-add-input input').focus();

            });
            $(document).on('keyup', '#group-add-input input', function(event) {
                /*
                 * 
                 * 获取写好的文本上传给服务器
                 * ajax给后台，后台更新数据库后返回json
                 * {
                 *     success:是否成功修改，如果不成功不能添加分组，并有错误提示，否则反之
                 *     id:返回分组的id
                 * }
                 * 
                 * */

                if(event.keyCode == 13) {
                    var thisVal = $(this).val();
                    $(this).val('');
                    //  ========== 
                    //  = ajax代码 = 
                    //  ========== 
                    $(this).parent('#group-add-input').hide();
                    $(this).parents('.group-add-box').find('#group-add').show();
                    $.post(obj.config.groupAddUrl, {
                        title: thisVal
                    }, function(o) {
                        var oj = JSON.parse(o);

                        if(oj.code == '1') {

                            obj.add(thisVal, 'testID', oj.href);
                            prompt.show({
                                text: oj.title,
                                position: 'bottom',
                            });

                        }

                    })

                }

            });
        },
        add: function(title, id, href) {
            //添加分组

            var item = getGroupItem(title);
            item.attr('id', id);
            item.find('a').attr('href', href); //id右
            $('#GroupBox .group-item:last').after(item);

        },
        sort: function() {
            /*
             * 
             * 排序
             * 在客户端进行排序
             * each .group-item ，循环将data-sort进行更新，从小到大
             * 并将id和排序保存成arr格式ajax到后台，后台遍历json更新数据库中的排序
             * 服务器返回json
             * {
             *     success:是否成功，要求有提示
             * }
             * 
             */

            var sortJson = [];

            $('.group-item:not(.group-mr)').each(function(index, element) {
                $(this).attr('data-sort', (index + 1)); //设置排序属性
                sortJson[index] = {};
                sortJson[index].group_id = $(this).attr('id');
                sortJson[index]['sort'] = $(this).attr('data-sort');

            });
            //  ========== 
            //  = ajax上传代码 = 
            //  ========== 
            $.post(obj.config.groupSortUrl, {
                sortInfo: sortJson
            }, function(o) {
                var oj = JSON.parse(o);

            })

        }

    }

    function getGroupItem(title) {

        var move = $("<span/>").addClass('group-move').append($('<i/>').addClass('glyphicon glyphicon-option-vertical'));

        var titleA = $('<a/>').addClass('title').text(title);
        var input = $('<input/>').attr({
            type: 'text',
            maxlength: '8',
            value: title,

        });

        var toolBox = $('<span/>').addClass('group-item-right');

        var edit = $('<span/>').addClass('glyphicon glyphicon-pencil edit-group').attr({
            'data-mtpis': '编辑'
        });
        var remove = $('<span/>').addClass('glyphicon glyphicon-remove remove-group').attr({
            'data-mtpis': '删除',
            'data-mtpis-style': 'danger'
        });
        toolBox.append(edit).append(remove);
        //
        return $('<li/>').addClass('group-item').append(move).append(titleA).append(input).append(toolBox);

    }

    return obj;

})();
group.init();