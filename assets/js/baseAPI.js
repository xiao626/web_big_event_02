//1. 开发环境服务器地址
var baseURL = "http://ajax.frontend.itheima.net"
//2. 测试环境服务器地址
// var baseURL = "http://ajax.frontend.itheima.net"
//3. 生产环境服务器地址
// var baseURL = "http://ajax.frontend.itheima.net"

// 拦截所有ajax请求： get/post/ajax;
// 处理参数
$.ajaxPrefilter(function (params) {
    //拼接对因环境的服务器地址
    params.url = baseURL + params.url;

    // 对需要权限的接口配置头像信息
    // 必须以my开头才行
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }

    // 拦截所有相应，判断身份认证信息
    params.complete = function (res) {
        // console.log(res);
        // 判断， 如果是身份认证失败，跳转回登录页面
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 删除token
            localStorage.removeItem("token");
            // 跳转页面
            location.href = '/login.html';
        }
    }
})