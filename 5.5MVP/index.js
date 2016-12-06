//MVP模式
//model View Presenter(管理者)
//View 不能直接饮用Model层的数据，而是通过 Presenter层实现对model内数据的访问。所有层次的交互都发生在 Presenter中

~(function(window){
    //MVP构造函数
    var MVP = function(){

    };
    MVP.model = function(){
        //内部数据对象
        var M = {};
        //服务器端 获取到的数据
        M.data = {};
        //配置数据，页面加载时即提供
        M.conf = {};
        //返回数据模型层对象操作方法
        return {
            //获取服务端数据
            getData : function(m){
                return M.data[m];
            },
            getConf:function(c){
                return M.conf[c];
            },
            setData:function(m,v){
                M.data[m] = v;
                return this;
            },
            setConf:function(c,v){
                M.conf[c] = v;
                return this;
            }
        }
    };
    //可以像Zen Coding那样也模板，如  li.@model @choose @last[data-mode=@mode]>
    //@为变量名，# id， . class，+ 兄弟元素,> 下级元素
    MVP.view = function(){
        return function(str){
            //子元素或兄弟元素替换模板
            var REPLACEKEY = '__REPLACEKEY__';
            //获取完整元素模板
            function getHTML(str,type){ //type 元素类型
                //简化实现，只处理字符串中第一个{}里面的内容
                return str
                    .replace(/^(\w+) ([^\{\}]*)?(\{([@\w]+)\})?(.*?)$/,function(match,$1,$2,$3,$4,$5){
                        $2 = $2 || '';  //元素属性参数容错处理
                        $3 = $3 || '';  //{元素内容}参数容错处理
                        $4 = $4 || '';  //元素内容参数容错处理
                        $5 = $5.replace(/\{([@\w]+)\}/g,'');//去除元素内容后面添加的元素属性

                        return type === 'in' ? 
                                '<' + $1 + $2 + $5 + '>' + $4 + REPLACEKEY + '</' + $1 + '>' :
                                type === 'add' ? 
                                    '<' + $1 + $2 + $5 + '>' + $4  + '</' + $1 + '>' + REPLACEKEY :
                                    '<' + $1 + $2 + $5 + '>' + $4  + '</' + $1 + '>';
                    })
                    //处理特殊标识# -- id属性
                    .replace(/#([@\-\w]+)/g,' id="$1"')
                    //处理 class属性
                    .replace(/\.([@\-\s\w]+)/g,' class="$1"')
                    //处理其他属性组
                    .replace(/\[(.+)\]/g,function(match,key){
                        //元素属性组
                        var a = key 
                                .replace(/'|"/g,'') //过滤引号
                                .split(' '),
                            h = '';
                        for(var j = 0,len = a.length;j<len;j++){
                            h += ' ' + a[j].replace(/=(.*)/g,'="$1"');
                        }
                        return h;
                    })
                    //处理可替换内容，根据不同模板渲染引擎自由处理
                    .replace(/@(\w+)/g,'{#$1#}');
            }
            //数组迭代器
            function eachArray(arr,fn){
                for(var i =0 ,len=arr.length;i<len;i++){
                    fn(i,arr[i],len);
                }
            }
            /**
             * 替换子元素模板或兄弟元素模板
             * @param str 原始字符串
             * @param rep 兄弟元素模板或子元素模板
             */
            function formatItem(str,rep){
                //用对应元素字符串替换兄弟元素模板或者子元素模板
                return str.replace(new RegExp(REPLACEKEY,'g') , rep);
            }
            //模板解析器
            return function(str){
                //模板层级数组
                var part = str
                        //去除首尾空白符
                        .replace(/^\s+|\s+$/g,'')
                        //去除 > 两端空白符
                        .replace(/^\s+(>)\s+/g,'$1')
                        .split('>'),
                    //模板视图根模板
                    html = REPLACEKEY,
                    //同层元素
                    item,
                    //同级元素模板
                    nodeTpl;
                eachArray(part,function(partIndex,partValue,partLen){
                    //为同级元素分组
                    item = partValue.split("+");
                    //设置同级元素初始模板
                    nodeTpl = REPLACEKEY;
                    //遍历同级每个元素
                    eachArray(item,function(itemIndex,itemValue,itemLen){
                        //用渲染元素得到的模板去渲染同级元素模板，简化了逻辑处理
                        //如果itemIndex对应元素不是最后一个，则作为兄弟元素处理
                        //否则如果 partIndex对应的层级不是最后一个则作为父层级处理
                        //该层级有子层级，该元素为父元素，否则该元素无兄弟元素，无子元素
                        nodeTpl = formatItem(nodeTpl,getHTML(itemValue,itemIndex === itemlen - 1 ? (partIndex === partLen - 1 ? '' : 'in') : 'add'))
                    });
                    //用渲染子层级得到的模板去渲染父层级模板
                    html = formatItem(html,nodeTpl);
                })
                return html;
            }
            // //将参数字符串转换为期望的模板
            // return html;
        }
    };

    MVP.presenter = function(){
        var V = MVP.view;
        var M = MVP.model;
        var C = {
            nav:function(M,V){
                var data = M.getData("nav");
                var tpl = V('li.@model @choose @last[data-mode=@mode]>');
            }
        };
        return {
            init:function(){
                for(var i in C){
                    C[i] && C[i](M,V,i);
                }
            }
        }
    };
    //入口
    MVP.init = function(){
        this.presenter.init();
    }
    window.MVP = MVP;
})(window)