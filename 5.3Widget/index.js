//web widget

F.module('lib/template',function(){
    //模板引擎，处理数据与编译模板入口
    var _TplEngine = function(str,data){ //str 模板容器id或模板字符串 ，data渲染数据
            if(data instanceof Array){
                var html = '',
                    i = 0,
                    len = data.length;
                for(;i<len;i++){
                    html += _getTpl(str)(data[i]);
                    //也可以 html += arguments.callee(str,data[i]);
                }
                return html;
            }else{
                return _getTpl(str)(data);
            }
        },
        _getTpl = function(str){ //str 模板容器id或模板字符串 
            var ele = document.getElementById(str);
            if(ele){
                var html = /^(textarea|input)$/i.test(ele.nodeName) ? ele.value : ele.innerHTML;
                return _compileTpl(html);
            }else{
                return _compileTpl(str);
            }
        },
        //处理模板
        _dealTpl = function(str){
            /**
             * 模板 <a>{%=test%}</a>
             * 处理后为 template_array.push('<a>',typeof(test) === 'undefined' ? '': test,'</a>');
             */
            var _left = '{%',
                _right = '%}';
            return String(str)
                    .replace(/&lt;/g,'<')
                    .replace(/&gt;/g,'>')
                    //过滤回车符，制表符，换行符
                    .replace(/[\r\t\n]/g,'')
                    //替换内容
                    .replace(new RegExp(_left + '=(.*?)' + _right,'g'),"",typeof($1) === 'undefined' ? '' : $1,"")
                    //替换左分隔符
                    .replace(new RegExp(_left,'g'),"');")
                    //替换右分隔符
                    .replace(new RegExp(_right,'g'),"template_array.push('");
        },
        //编译模板
        _compileTpl = function(str){
            //技巧，通过new Function 将我们模块字符串转化为函数体执行的语句
            var fnBody = [ "var template_array=[];\n",
                           "var fn = (function(data){\n",
                                "var template_key = '';\n",
                                "for(key in data){\n",
                                    "template_key +=('var ' + key + '=data[\"'+key+'\"];');\n",
                                "}\n",
                                "eval(template_key);\n",
                                "template_array.push('"+_dealTpl(str)+"');\n",
                                "template_key = null;\n",
                           "})(templateData);\n",
                           "fn = null;\n",
                           "return template_array.join('');"
                        ].join('');
            return new Function("templateData",fnBody);
        };
    return _TplEngine;
})