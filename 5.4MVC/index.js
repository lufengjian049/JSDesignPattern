//MVC模式
//模型(数据) 视图() 控制器(业务逻辑)

//Model为模型层，最底层
//View 视图层，可以调用数据层的数据创建视图
//Controller 控制器层，调用 模型层数据 与 视图层的视图 来创建页面，添加交互逻辑

//引用A框架
//基本结构
A(function(){
    var MVC = MVC || {};
    MVC.model = function(){
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
    }();
    MVC.view = function(){
        var M = MVC.model;
        var V = {

        };
        return function(v){
            V[v]();
        }
    }();
    MVC.ctrl = function(){
        var M = MVC.model,
            V = MVC.view,
            C = {

            };
        for(var i in C){
            C[i] && C[i]();
        }
    }();
});


//简单实现
A(function(){
    var MVC = MVC || {};
    MVC.model = function(){
        //内部数据对象
        var M = {};
        //服务器端 获取到的数据
        M.data = {
            slideBar:[
                {
                    text:"",
                    icon:""
                }
            ]
        };
        //配置数据，页面加载时即提供
        M.conf = {
            slideBarCloseAnimate:false
        };
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
    }();
    MVC.view = function(){
        var M = MVC.model;
        var V = {
            createSildeBar:function(){
                var data = M.getData("slideBar")
                //通过模板，运用简单的formateString 方法,用data数据 去 格式化模板
                //最后appendTo('body')
            }
        };
        return function(v){
            V[v]();
        }
    }();
    MVC.ctrl = function(){
        var M = MVC.model,
            V = MVC.view,
            C = {
                initSlideBar : function(){
                    //先渲染 视图
                    V("createSildeBar");
                    //再绑定元素的交互事件
                }
            };
        for(var i in C){
            C[i] && C[i]();
        }
    }();
});

//缺点 数据耦合在模型层中 ，降低了视图创建的灵活性和复用性