//单例模式--是只允许实例化一次的对象类

//1.定义命令空间(Jquery库)，方法都挂在命令空间下， var NameSpace = {method:function name(params) {}};
//命名空间还可以分模块
var A = {
    Util : {
        util_method1:function(){},
        util_method2:function(){},
    },
    ajax : {
        ajax_method1:function(){}
    }
}

//2.管理静态变量（只能访问不能修改，并且没有创建后就能使用）
//思路:全局变量不行(要求不能访问)，所以只能是函数内部的变量，然后暴露可以取得方法

var Conf = (function(){
    //私有变量
    var conf = {
        MAX_NUM:100,
        MIN_NUM:0
    },
    return {
        get:function(name){
            return conf[name] || null;
        }
    }
})();

var max = Conf.get("MAX_NUM");

//延迟创建单例对象，惰性单例 惰性创建

var LazySingle = (function(){
    //单例实例引用
    var _instance = null;
    function Single(){
        //这里定义私有属性，方法
        return {
            publicMethod:function(){},
            publicProperty:'1.0'
        }
    }
    //获取单例对象接口
    return function(){
        if(!_instance){
            _instance = Single();   // 没有new,single返回的是一个{}
        }
        //返回单例
        return _instance;
    }
})();

console.log(LazySingle().publicProperty);
