//中介者模式
//通过中介者对象封装一系列对象之间的交互，是对象之间不再相互引用，降低他们之间的耦合。
//观察者模式也是解决模块之间的耦合，与中介者的区别在于，中介者单向通信，发送消息只有中介者对象，而且中介者对象不能订阅信息，只有订阅者才能订阅中介者的小心，而观察者模式中，一个对象既可以是消息的发送者也可以是消息的接受者，他们之间
//消息交流依托于消息系统实现的解耦

//由一个模块 向各个模块发送消息，各个模块之间没有交互行为，交互在中介者对象内部实现
//中介者对象
var Mediator = function(){
    var _msg = {};
    return {
        register:function(type,action){
            if(!_msg[type]){
                _msg[type] = [];
            }
            _msg[type].push(action);
        },
        send:function(type){
            if(_msg[type]){
                for(var i =0,len=_msg[type].length;i<len;i++){
                    _msg[type][i] && _msg[type][i]();
                }
            }
        }
    }
}();
//显隐小组件
var showHideNavWidget = function(){

}

//某模块
(function(){
    Mediator.register("hideAllNavNum",function(){
        showHideNavWidget();
    });
    //....
})()

//某模块
(function(){
    Mediator.register("hideAllNavNum",function(){
        showHideNavWidget();
    });
    //....
})()

//设置层，发送消息 控制层
(function(){
    //某些事件 去触发 消息提醒功能
    Mediator.send("hideAllNavNum");
    // 。。。。。
})()


