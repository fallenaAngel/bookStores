require(["jquery", "locationStorage", "locationFormat", "jsonp", "base64", "render"], function ($, locationStorage, locationFormat, jsonp, base64, render) {
    function Init() {
        //定义全局变量
        this.articalCon = $("section.artical-con");
        this.setWrapBox = $("section.set-wrap");
        this.setPanel = $("div.set-panel");

        this.initFSize = locationStorage.get("fontSize") || 14;
        
        
        this.initBg = locationStorage.get("bgcolor") || "#f7eee5";
        this.articalCon.css("background", this.initBg);
        this.initBgIndex = locationStorage.get("initBgIndex") || 0;
        $("ul.set-bg-btns li").eq(this.initBgIndex).addClass("active").siblings().removeClass("active");


        this.isLight = true;
        this.nightBg = "#0f1410";
        this.chooseBg = this.initBg;
        if (locationStorage.get("tagBg") && locationStorage.get("tagBg") == "夜晚") {
            this.isLight = false;
        }
        if (this.isLight) {
            this.articalCon.css("background", this.chooseBg);
        } else {
            this.articalCon.css("background", this.nightBg);
        }


        this.initChapterNum = locationStorage.get("chapterNum") || 0;
        this.fiction_id = locationFormat().fiction_id;
        //定义原型方法
        //  1.设置模块点击显示，及相关功能
        this.setWrap();
        //  2.章节划分
        this.chapterDivided();
        this.chapterCon();
        // this.nextChapter();
    }

    Init.prototype.setWrap = function () {
        var that = this;
        this.articalCon.on("click", function () {
            that.setPanel.addClass("none");
            $("dl.size").removeClass("active");
            that.setWrapBox.show();
            that.setNight();

            //点击返回
            $("div.set-t span.icon-circle-back").on("click", function () {
                history.go(-1);
            });
            //点击中心隐藏设置面板
            $("div.mask").on("click", function () {
                that.setWrapBox.hide();
            });
            // 点击字体，开始设置字体大小，背景颜色
            $("dl.size").on("click", function () {
                that.setPanel.toggleClass("none");
                $(this).toggleClass("active");
                that.setFontSize();
                that.setBg();
            });
            //点击目录，跳转到指定页面
            $("dl.chapterList").on("click", function () {
                window.location.href = "../../page/chapterList.html?fiction_id=352876&chapterNum=" + that.initChapterNum;
            });
        });
    }

    // 点击改变字体大小
    Init.prototype.setFontSize = function () {
        var that = this;
        $("button.large-btn").on('click', function () {
            if (that.initFSize < 30) {
                that.initFSize += 2;
                locationStorage.set("fontSize", that.initFSize);
                $("section.artical-con p").css("font-size", that.initFSize / 37.5 + "rem");
            }
        });
        $("button.samll-btn").on('click', function () {
            if (that.initFSize > 10) {
                that.initFSize -= 2;
                locationStorage.set("fontSize", that.initFSize);
                $("section.artical-con p").css("font-size", that.initFSize / 37.5 + "rem");
            }
        });
    }

    // 点击改变背景颜色
    Init.prototype.setBg = function () {
        var that = this;
        $("ul.set-bg-btns").on("click", 'li', function () {
            if (that.isLight) {
                that.initBg = $(this).attr("bg-color");
                that.chooseBg = that.initBg;
                that.initBgIndex = $(this).index();
                locationStorage.set("bgcolor", that.initBg);
                locationStorage.set("initBgIndex", that.initBgIndex);
                that.articalCon.css("background", that.initBg);
                $("ul.set-bg-btns li").eq(that.initBgIndex).addClass("active").siblings().removeClass("active");
            }

        });
    }

    //  点击夜晚
    Init.prototype.setNight = function () {
        var that = this;
        $("dl.day").on("click", function () {
            var val = $(this).find("dd");
            $(this).toggleClass("light");
            if (that.isLight) {
                that.articalCon.css("background", that.nightBg);
                locationStorage.set("tagBg", "夜晚");
            } else {
                that.articalCon.css("background", that.chooseBg);
                locationStorage.set("tagBg", "白天");

            }
            that.isLight = !that.isLight;
        });
    }

    //  发起ajax请求，判断总共有多少章节
    Init.prototype.chapterDivided = function () {
        var that = this;
        $.ajax({
            url: "/api/detailList",
            dataType: "json",
            data: {
                fiction_id: that.fiction_id
            },
            success: function (data) {
                var len = data.item.toc.length;
                $("span.total-chapter").html(len);
                $("span.cur-chapter").html(that.initChapterNum);
            },
            error: function (err) {
                console.error(err);
            }
        });
    }

    //  发起ajax请求，获取章节内容
    Init.prototype.chapterCon = function () {
        var that = this;
        $.ajax({
            url: "/api/chapterCon",
            dataType: "json",
            data: {
                fiction_id: that.fiction_id,
                chapterNum: that.initChapterNum
            },
            success: function (data) {
                if (data.result == 0) {
                    that.articalConRender(data.url);
                }
            },
            error: function (err) {
                console.error(err);
            }
        });
    }
    Init.prototype.articalConRender = function (url) {
        var that=this;
        jsonp({
            url: url,
            cache: true,
            callback: "duokan_fiction_chapter",
            success: function (data) {
                var str = $.base64.atob(data, true);
                var json = JSON.parse(str);
                console.log(json);
                render(json, $("#artical_con_render"), $("#artical_con"),true);
                console.log(that.initFSize)
                $("section.artical-con p").css("font-size", that.initFSize / 37.5 + "rem");
            }
        });
    }
    Init.prototype.nextChapter = function () {
        var that=this;
        $("span#next_chapter").on("click", function () {
            if (that.initChapterNum<5){
                that.initChapterNum+=1;
                that.chapterCon();
                locationStorage.set("chapterNum", that.initChapterNum);
                $("span.cur-chapter").html(that.initChapterNum);
            } else {
                alert("已经是最后一章");
            }
        });
        $("span#prev_chapter").on("click", function () {
            if (that.initChapterNum>0){
                that.initChapterNum -= 1;
                that.chapterCon();
                locationStorage.set("chapterNum", that.initChapterNum);
                $("span.cur-chapter").html(that.initChapterNum);
            }else{
                alert("已经是最后一章");
            }
        });
    }
    new Init();
    //$("div.wrap").removeClass("none");
});