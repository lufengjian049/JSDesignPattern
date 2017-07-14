 //Function的使用,将模板转化为可以执行的代码
 var testFn = new Function('data','return data')
 console.log(testFn(111))
 //111
  var testFn2 = new Function('data1','data2','return data1+data2')
 console.log(testFn2(111,222))
 //333

//eval，将参数映射为对应的变量，供函数体使用
var template_keys = '';
var data = {
  aa:1,
  b:2
}
for(var key in data){
	// template_keys += ('var '+ key + '=data." + key + ';');
  template_keys += "var "+key+"= data."+key+";"
}
console.log(template_keys)
eval(template_keys);
console.log(aa)  //1

var complieTpl = function(str){
  var fnBody = [
    'var htmlArr=[],tpl_key="";',
    'for(var key in data){',
    "tpl_key+=('var '+key+'=data.'+key+';');",
    '}',
    'eval(tpl_key);',
    "htmlArr.push('"
  ].join("\n") + detailTpl(str) + [
    "')",
    'tpl_key = null;',
    'return htmlArr.join("")'
  ].join("\n");
  console.log(fnBody)
  return new Function('data',fnBody)
 }
 //敲重点
 //首先必须先将<%=test%>转为 ',typeof(test) === undefined ? '' : test,'  实则是在一个push方法内部
 // 2.将左边的 转为 push 结束
 // 3 将右边的 转为 push 开始
 var detailTpl = function(str){
    var left = "<%",right = "%>";
    return str.replace(/&lt;/g,'<')
              .replace(/&gt;/g,'>')
              .replace(/[\r\n\t]/g,'')
              .replace(new RegExp(left + "=(.*?)" + right,"g"),"',typeof($1) === undefined ? '' : $1,'")
              .replace(new RegExp(left,'g'),"');\n")
              .replace(new RegExp(right,"g"),"htmlArr.push('")
}
var teststr = '<div class="data-lang <%if(is_selected){%>selected<%}%>" data-value="<%=value%>">'
                +'<%for(var i = 0,j; j=ary[i++];){%>'
                  +'<a href="#"><%= j.text %></a>'
                +'<%}%>'
              +'</div>';
            
console.log(complieTpl(teststr)({
	is_selected: true,
	value: 'test',
	ary: [{
		text: 1
	}, {
		text: 2
	}]
}))