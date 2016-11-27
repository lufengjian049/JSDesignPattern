//状态模式
//解决分支判断臃肿的问题(if),将每一种分支条件，转化为对象内部的一种状态

//雏形
var ResultState = function(){
    var States = {
        state0:function(){
            console.log("第一种情况")
        },
        state1:function(){
            console.log("")
        }
    };
    var show = function(result){
        States['state'+result] && States['state'+result]()
    }
    return {
        show:show
    }
}

ResultState.show(1);

//晋级模式，状态对象作为内部的私有变量，然后提供一个能够调用内部私有变量的方法
//关键 可以做 条件 组合 

var MarryState = function(){
    var _currentState = {},
        states = {
            jump:function(){

            },
            move:function(){

            },
            shoot:function(){

            }
        };
    //动作控制类
    var Action = {
        changeState:function(){
            var arg = arguments;
            _currentState = {};
            if(arg.length){
                for(var i =0,len = arg.length;i<len;i++){
                    _currentState[arg[i]] = true;
                }
            }
            return this;
        },
        goes:function(){
            for(var key in _currentState){
                states[key] && states[key]();
            }
            return this;
        }
    }

    return {
        change:Action.changeState,
        goes:Action.goes
    }
}

MarryState().change("jump","shoot").goes();  //不推荐 不安全

var marry = new MarryState();
marry.change("jump","shoot")
        .goes();