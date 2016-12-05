//异步模块加载

//闭包环境 封闭已创建的模块，防止外界对其直接访问，
//并在闭包中创建模块管理器F，并作为借口保存在全局作用域中

//向闭包中传入F（~ 屏蔽压缩文件时，前面漏写 ; 报错）
~(function(F){
    /**
     * 创建或调用模块方法
     * @param url 模块url
     * @param deps 依赖模块
     * @param callback 模块主函数
     */
    F.module = function(url,modDeps,modCallback){
        var args = [].slice.call(arguments),
            callback = args.pop(),
            deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : [],
            url = args.length ? args.pop() : null,
            //依赖模块序列
            params = [],
            //未加载的依赖模块数量统计
            depsCount = 0,
            i = 0,
            //依赖模块序列长度
            len;
        if(len = deps.length){
            while(i < len){
                (function(i){
                    //添加未加载依赖模块数量统计
                    depsCount++;
                    //异步加载依赖模块
                    loadModule(deps[i],function(mod){
                        //依赖模块序列中添加依赖模块接口引用
                        params[i] = mod;
                        //依赖模块加载完成，统计减一
                        depsCount--;
                        if(depsCount === 0){ //全部加载完
                            //在模块缓存器中矫正该模块，并执行构造函数
                            setModule(url,params,callback);
                        }
                    })
                })(i);
                i++;
            }
        }else{
            //无依赖模块的，直接执行回调函数
            setModule(url,[],callback);
        }
    }
    //模块缓存器
    var moduleCache = {},
        /**
         * 异步加载依赖模块所在文件
         * @param moduleName 模块路径(id)
         * @param callback 模块加载完成回调函数
         */
        loadModule = function(moduleName,callback){
            //依赖模块
            var _module;
            if(moduleCache[moduleName]){
                _module = moduleCache[moduleName];
                //已经加载完成
                if(_module.status === 'loaded'){
                    setTimeout(callback(_module.exports),0);
                }else{
                    //缓存该模块所处文件加载完成回调函数
                    _module.onload.push(callback);
                }
            }else{ //模块第一次被依赖引用
                moduleCache[moduleName] = {
                    moduleName : moduleName,
                    status : 'loading',
                    exports : null, //模块接口
                    onload : [callback] //模块对应文件加载完成回调函数缓冲器
                };
                loadScript(getUrl(moduleName));
            }
        },
        /**
         * 设置模块并执行模块构造函数
         * @param moduleName 模块id名称
         * @param params 依赖模块
         * @param callback 模块构造函数
         */
        setModule = function(moduleName,params,callback){
            var _module,fn;
            if(moduleCache[moduleName]){
                _module = moduleCache[moduleName];
                _module.status = 'loaded';
                //矫正模块接口
                _module.exports = callback ? callback.apply(_module,params) : null;
                //执行模块文件加载完成回调函数
                while(fn = _module.onload.shift()){
                    fn(_module.exports);
                }
            }else{
                //模块不存在(匿名模块)，直接执行构造函数
                callback && callback.apply(null,params);
            }
        },
        getUrl = function(moduleName){
            return String(moduleName).replace(/\.js$/g,'') + '.js';
        },
        loadScript = function(src){
            var _script = document.createElement('script');
            _script.type = 'text/JavaScript';
            _script.charset = 'UTF-8';
            _script.async = true;
            _script.src = src;
            document.getElementsByTagName('head')[0].appendChild(_script);
        }
})((function(){
    //创建模块管理器对象F，并保存在全局作用域中
    return window.F = {};
})())


//使用
//1.在lib/dom.js中定义dom模块
F.module('lib/dom',function(){
    return {
        g:function(id){
            return document.getElementById(id);
        },
        html:function(id,html){
            if(html)
                this.g(id).innerHTML = html;
            else
                return this.g(id).innerHTML;
        }
    }
});
//2.在event模块中，定义
F.module('lib/event',['lib/dom'],function(dom){
    var events = {
        on:function(id,type,fn){
            dom.g(id)['on'+type] = fn;
        }
    }
    return events;
});
//用 index.html
F.module(['lib/event','lib/dom'],function(events,dom){
    events.on('demo','click',function(){
        dom.html("demo","success");
    })
})

//思考：如何实现对样式文件的加载依赖呢？？
