$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    var q = {
        pagenum: 1,	    //是页码值
        pagesize: 2,	//是每页显示多少条数据
        cate_id: "",    //否文章分类的 Id
        state: "",	    //否文章的状态，可选值有：已发布、草稿
    }

    // 为时间定义过滤器
    template.defaults.imports.dataFormat = function (dtStr) {
        var dt = new Date(dtStr);

        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 事件加0函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    initTable()
    initCate()


    // 获取文章列表
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
                // 分页
                renderPage(res.total);
            }
        })
    }



    // 初始化分类
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取
        var state = $("[name=state]").val()
        var cate_id = $("[name=cate_id]").val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化列表
        initTable();
    })

    // 分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 当前页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页显示多少条数据
            jump: function (obj, first) {
                // obj包含了当前分页的所有参数，
                // console.log(first, obj.curr, pbj.limit);
                // 赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 首次不执行
                if (!first) {
                    initTable();
                }
            }
        });

        // 删除
        $("tbody").on("click", ".btn-delete", function () {
            var Id = $(this).attr("data-id");
            layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + Id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg(res.message)
                        }
                        initTable();
                        layer.msg("恭喜您，文章删除成功")
                        // 页面汇总删除按钮个数等于1，页面大于1；
                        if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    }
                })

                layer.close(index);
            });
        })

    }
})