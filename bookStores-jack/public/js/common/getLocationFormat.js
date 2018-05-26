define(function () {  
    function locationFormat() {  
        var str=location.search;
        var jsonObj={};
        if(str.indexOf("?")!=-1){
            var arr=str.substr(1).split("&");
            arr.forEach(function (item,index) {  
                var newArr=item.split("=");
                jsonObj[newArr[0]] = newArr[1];
            });
        }
        return jsonObj;
    }
    return locationFormat;
});