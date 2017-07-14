//同步模块模式
//对模块实现同步调用

//定义模块管理器单体对象
var F = F || {};
/**
 * 定义模块方法(理论上，模块方法应放在闭包中实现，可以隐蔽内部信息，这里忽略了此步骤，留待思考 🤔🤔🤔🤔🤔🤔🤔)
 * @param str 模块路由
 * @param fn 模块方法
 */
F.define = function(str,fn){
    var parts = str.split("."),
        //old当前模块的祖父模式，parent当前模块父模块
        //如果在闭包中，为了屏蔽对模块的直接访问，建议将模块添加给闭包内部私有变量
        old  = parent = this,
        // i模块层级，len 模块层级长度
        i = len = 0;
    //如果第一个是模块管理器单体对象，则移除
    if(parts[0] === "F"){
        parts = parts.slice(1);
    }
    //屏蔽对define 和 module 模块方法的重写
    if(parts[0] === 'define' || parts[0] === "module"){
        return;
    }
    for(len = parts.length;i<len;i++){
        //如果父模块中不存在当前模块
        if(typeof parent[parts[i]] === void 0){
            //声明当前模块
            parent[parts[i]] = {};
        }
        //缓存下一层级的祖父模块
        old = parent;
        //缓存下一层级的父模块
        parent = parent[parts[i]];
    }
    if(fn){
        old[parts[--i]] = fn();
    }
    return this;
}

//测试
F.define("string",function(){
    return {
        trim:function(str){
            return str.replace(/^\s+|\s+$/g,'');
        }
    }
});
F.string.trim(" test ");

F.define("dom",function(){
    var $ = function(id){
        $.dom = document.getElementById(id);
        return $;
    }
    $.html = function(html){
        if(html){
            this.dom.innerHTML = html;
            return this;
        }else{
            return this.dom.innerHTML;
        }
    }
    return $;
});
F.dom("test").html();

F.define("dom.addClass");
F.dom.addClass = function(type,fn){
    return function(className){
        //如果不存在该类
        if(!~this.dom.className.indexOf(className)){
            this.dom.className += ''+ className;
        }
    }
}

//模块的调用方法
F.module = function(){
    var args = [].slice.call(arguments),
        //获取回调函数
        fn = args.pop(),
        //获取依赖模块，如果第一个数组
        parts = args[0] && args[0] instanceof Array ? args[0] : args,
        modules = [],
        modIDs = "",
        i = 0,
        ilen = parts.length,
        //父模块，模块路由层级索引，模块路由层级长度
        parent,j,jlen;

    while(i < ilen){
        if(typeof parts[i] === 'string'){
            //设置当前模块父对象(F)
            parent = this;
            //解析模块路由，并屏蔽掉模块父对象
            modIDs = parts[i].replace(/^F\./,'').split(".");
            //遍历模块路由层级
            for(j=0,jlen = modIDs.length;j<jlen;j++){
                //重置父模块
                parent = parent[modIDs[j]] || false;
            }
            modules.push(parent);
        }else{
            //如果是模块对象
            modules.push(parts[i]);
        }
        i++;
    }
    fn.apply(null,modules);
}

F.module(['dom',document],function(dom,doc){
    dom("test").html("new add");
    doc.body.style.background = "red";
})

F.module("dom","string.trim",function(dom,trim){
    var html = dom('test').html();
    var str = trim(html);
    console.log("#"+html+"#",str);
})


//思考
//将模块管理器F封装在闭包内，隐蔽模块的直接调用 ？？？？？？

var define,module;
(function(){
    var F = F || {};
    define = function(str,fn){
        var parts = str.split("."),
            //old当前模块的祖父模式，parent当前模块父模块
            //如果在闭包中，为了屏蔽对模块的直接访问，建议将模块添加给闭包内部私有变量
            old  = parent = F,
            // i模块层级，len 模块层级长度
            i = len = 0;
        //如果第一个是模块管理器单体对象，则移除
        if(parts[0] === "F"){
            parts = parts.slice(1);
        }
        //屏蔽对define 和 module 模块方法的重写
        if(parts[0] === 'define' || parts[0] === "module"){
            return;
        }
        for(len = parts.length;i<len;i++){
            //如果父模块中不存在当前模块
            if(typeof parent[parts[i]] === void 0){
                //声明当前模块
                parent[parts[i]] = {};
            }
            //缓存下一层级的祖父模块
            old = parent;
            //缓存下一层级的父模块
            parent = parent[parts[i]];
        }
        if(fn){
            old[parts[--i]] = fn();
        }
        // return this;
    };
    module = function(){
        var args = [].slice.call(arguments),
            //获取回调函数
            fn = args.pop(),
            //获取依赖模块，如果第一个数组
            parts = args[0] && args[0] instanceof Array ? args[0] : args,
            modules = [],
            modIDs = "",
            i = 0,
            ilen = parts.length,
            //父模块，模块路由层级索引，模块路由层级长度
            parent,j,jlen;

        while(i < ilen){
            if(typeof parts[i] === 'string'){
                //设置当前模块父对象(F)
                parent = F;
                //解析模块路由，并屏蔽掉模块父对象
                modIDs = parts[i].replace(/^F\./,'').split(".");
                //遍历模块路由层级
                for(j=0,jlen = modIDs.length;j<jlen;j++){
                    //重置父模块
                    parent = parent[modIDs[j]] || false;
                }
                modules.push(parent);
            }else{
                //如果是模块对象
                modules.push(parts[i]);
            }
            i++;
        }
        fn.apply(null,modules);
    }
})();

define("string",function(){
    return {
        trim:function(str){
            return str.replace(/^\s+|\s+$/g,'');
        }
    }
})
module("string.trim",function(trim){
    console.log(trim("  test tst  "))
})