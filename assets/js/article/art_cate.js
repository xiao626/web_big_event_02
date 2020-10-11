$(function () {
    // 文章类别列表
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template("tpl-art-cate", res)
                $("tbody").html(str);
            }
        })
    }

    // 2.显示添加文章风雷列表
    var layer = layui.layer;
    $("#btnAdd").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-add").html() //这里content是一个普通的String
        });
    })

    // 3.提交分类添加（事件委托）
    var indexAdd = null;
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，添加文章分类成功');
                initArtCateList();
                layer.close(indexAdd)
            }
        })
    })

    // 4.修改展示表单
    var indexEdit = null;
    var form = layui.form;
    $("body").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html() //这里content是一个普通的String
        });
        // 4.2 获取id，发送ajax获取数据，渲染到页面
        var Id = $(this).attr("data-id");
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
    })

    // 5.修改-提交
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.mas(res.message);
                }
                initArtCateList();
                layer.msg("恭喜您，文章修改成功");
                layer.close(indexEdit);
            }
        })
    })

    // 6.删除-提交
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id");
        // 显示对话框
        layer.confirm('是否确定删除', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: "/my/article/deletecate/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    initArtCateList();
                    layer.msg("删除文章成功！");
                    layer.close(index);

                }
            })
            // layer.close(index);
        });
    })
})