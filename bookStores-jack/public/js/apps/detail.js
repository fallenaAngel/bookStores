require(["jquery", "headerRender", "locationFormat", "text!bookTBtpl", "render", "locationStorage"], function ($, headerRender, locationFormat, bookTBtpl, render, locationStorage) {


    $("body").append(bookTBtpl);
    var fiction_id = locationFormat().fiction_id;

    //1.最上面 左右结构渲染
    topLRListRender();

    function topLRListRender() {
        $.ajax({
            url: "/api/detailList",
            dataType: "json",
            data: {
                fiction_id: fiction_id
            },
            success: function (data) {
                if(data){
                    headerRender({
                        "title": data.item.title
                    });
                    var json = [];
                    json.push(data.item);
                    render(json, $("#detail_lR_list_render"), $("#detail_top"));
                    var otherData = data.author_books;
                    render(otherData, $("#t-b-tpl"), $("#detail_book_otherBook_list"));
                    clickTo();
                    $("div.wrap").removeClass("none");
                }else{
                    headerRender({
                        "title": "空"
                    });
                    alert('没有相关数据');
                }
            },
            error: function (err) {
                console.log(err);
            }
        });

    }

    //2.点击最新章节可以跳转到章节列表
    function clickTo() {
        $("div#folder-tail").on("click", function () {
            window.location.href = "../../page/chapterList.html?fiction_id=" + fiction_id;
        });
        $("button.startRead_btn").on("click", function () {
            var user = locationStorage.get("login");
            if (!user) {
                window.location.href = "../../page/login.html";
            } else {
                window.location.href = "../../page/artical.html?fiction_id=" + fiction_id;
            }
        });
    }

});