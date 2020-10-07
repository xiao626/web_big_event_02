$(function () {
    // 1.点击去注册账号 ，隐藏登录区域，显示注册区域
    $("#link_reg").on("click", function () {
        $(".login-box").hide()
        $(".reg-box").show()
    });
    // 2.点击去登录 ，显示登录区域，隐藏注册区域
    $("#link_login").on("click", function () {
        $(".login-box").show()
        $(".reg-box").hide()
    })

    // 2.自定义校验规则
    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer
    // 校验规则
    form.verify({
        // 参数对象中的属性，未来将称为参数名称
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 3.确认密码规则
        repwd: function (value) {
            // 选择器必须带控格，选择的是后代中的input，name属性值为password的那个标签
            var pwd = $(".reg-box [name=password]").val()
            // 比较
            if (value !== pwd) {
                return "两次密码输入不一致"
            }
        }
    })

    // 4.注册功能
    $("#form-reg").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/api/reguser",
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),

            },
            success: function (res) {
                // 返回判断值
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg("注册成功，请登录");
                // 手动切换到登录列表
                $("#link_login").click();
                // 重置form表单
                $("#form-reg")[0].reset();
            }
        })
    })

    // 5.登录功能（给form标签绑定事件，button按钮触发提交 事件）
    $("#form_login").submit(function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 校验返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示信息，保存token，跳转页面
                layer.msg("恭喜您，登录成功！");
                // 保持token，未来的接口要使用token
                localStorage.setItem("token", res.token);
                // 跳转
                location.href = "/index.html"
            }
        })
    })
})