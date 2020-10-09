$(function () {
    var form = layui.form
    form.verify({
        // 1.1密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 1.2 新旧密码不重复
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return '原密码和旧密码不能相同！'
            }
        },
        // 1.3 两次密码必须相同
        repwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次新密码输入不一致！'
            }
        }
    })

    // 2.表单提交
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取密码失败")
                }
                layui.layer.msg("恭喜你，获取密码成功")
                // 重置表单
                $(".layui-form")[0].reset()
            }
        })
    })
})