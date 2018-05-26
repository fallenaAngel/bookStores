require.config({
    baseUrl:"/js/",
    paths:{
    	//库
        "jquery":"libs/jquery-3.3.1.min",
        "handlebars":"libs/handlebars",
        "swiper":"libs/swiper.min",
        "bscroll":"libs/bscroll.min",
        "text":"libs/text",
        "jsonp":"libs/jquery.jsonp",
        "base64":"libs/jquery.base64",
        "lazyload": "libs/jquery.lazyload",

        //common
        "render":"common/render",
        "bookTBtpl":"../page/tpl/book-t-b-list.html",
        "bookLRtpl":"../page/tpl/book-l-r-list.html",
        "bookLRLimitTpl":"../page/tpl/book-l-r-limitList.html",
        "header":"../page/tpl/header-render.html",
        "headerRender":"./common/headerRender",
        "locationStorage":"./common/locationStorage",
        "locationFormat":"./common/getLocationFormat",
        
        //user
        "index":"apps/index",
        "search":"apps/search",
        "detail":"apps/detail",
        "chapterList":"apps/chapterList",
        "artical":"apps/artical",
        "login":"apps/login"
    },
    shim:{
        "base64":{
            deps:["jquery"]
        }
    }
});