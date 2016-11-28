//观察者模式
//发布-订阅模式或消息机制，定义了一种依赖关系，解决主体对象与观察者之间功能的耦合。
//被观察者或者说是主体对象
//观察者对象有一个消息容器和三个方法（订阅，注销，发布）

//消息发布系统
var Observer = (function(){
    //防止消息队列暴露而被篡改，将消息容器作为静态私有变量
    var __messages = {};
    return {
        regist:function(type,fn){
            if(typeof __messages[type] === 'undefined'){
                __messages[type] = [fn];
            }else{
                __messages[type].push(fn);
            }
        },
        fire:function(type,args){
            if(!__messages[type]){
                return;
            }
            //定义消息信息
            var events = {
                type :  type,
                args : args || {}
            },
            i = 0,
            len = __messages[type].length;

            for(;i<len;i++){
                __messages[type][i].call(this,events);
            }
        },
        remove:function(type,fn){
            if(__messages[type] instanceof Array){
                var i = __messages[type].length - 1;
                for(;i>= 0;i--){
                    __messages[type][i] === fn && __messages[type].splice(i,1);
                }
            }
        }
    }
})();

//不同对象 通过 消息发布系统 注册 和发布 信息
Observer.regist("test",function(e){
    console.log(e.type,e.args.msg);
})

Observer.fire("test",{msg:"传递参数"});


//观察者模式最主要的最作用是解决类或者对象之间的耦合，解耦两个相互依赖的对象，使其依赖于观察者的消息机制。

//对比 DOM的事件，有啥异同点？？？？  DOM事件不可传递参数，观察者模式可以传递自定义参数