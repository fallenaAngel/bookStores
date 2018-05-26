define(["jquery","handlebars"],function($,handlebars){
	function render(data,source,target,isRefresh){
		var sources=source.html();
		var template=handlebars.compile(sources);

		handlebars.registerHelper("addIndex2", function (index) {
			index+=2;
			return index;
		});

		handlebars.registerHelper("wordNum", function (num) {
			num=parseInt(num/10000);
			return num;
		});

		handlebars.registerHelper("limit", function (index) {//用limit方法判断取前4条数据
			if(index<4){
				return true
			}else{
				return false
			}
		});
		handlebars.registerHelper("limit2", function (index) { //用limit方法判断取前4条数据
			if (index < 5) {
				return true
			} else {
				return false
			}
		});
		var html=template(data);
		if(isRefresh){
			target.html(html);
		}else{
			target.append(html);
		}
	}
	return render;
});