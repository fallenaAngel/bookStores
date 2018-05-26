define(["jquery", "locationStorage"], function ($, locationStorage) {
    var loginBtn = $("#login_btn");
    loginBtn.on("click", function () {
        var user = $("#user").val();
        var pwd = $("#pwd").val();
        console.log(user, pwd);
        if (user == "" || pwd == "") {
            alert("请输入用户名或密码");
        } else {
            $.ajax({
                url: "/login",
                dataType: "json",
                type:"POST",
                data: {
                    user: user,
                    pwd: pwd
                },
                success: function (data) {
                   if(data.code==0){
                       alert("登录成功");
                        locationStorage.set("login",true);
                       history.go(-1);
                   } else if (data.code == 1){
                       locationStorage.set("login", false);
                        alert("登录失败，请重新登录");
                   }
                },
                error: function (err) {
                    console.error(err);
                }
            });
        }
    });

});