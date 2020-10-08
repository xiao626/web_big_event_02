$(function () {
    // 1.获取用户信息
    getUserInfo()

    // 2.退出
    var layer = layui.layer
    $("#btnLogout").on("click", function () {
        // 框架提供的询问框
        layer.confirm('是否退回到登录页面?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // alert(111)
            // 1.清空本地token
            localStorage.removeItem("token");
            // 2.页面跳转
            location.href = "/login.html";

            layer.close(index);
        });
    })
})

// 获取用户信息封装函数
// 位置写到峪口函数外面
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: "/my/userinfo",
        //配置请求头信息
        // headers: {
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        // 无论成功或者失败，都触发complete方法
        // complete: function (res) {
        //     console.log(res);
        //     // 判断， 如果是身份认证失败，跳转回登录页面
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败") {
        //         // 删除token
        //         localStorage.removeItem("token");
        //         // 跳转页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}

// 封装用户头像渲染函数
function renderAvatar(user) {
    // 1.用户名（昵称优先，没有用username）
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    //用户头像
    if (user.user_pic !== null) {
        // 2.有头像
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".user-avatar").hide();
    } else {
        // 没有头像
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase();
        $(".user-avatar").show().html(text);
    }







}