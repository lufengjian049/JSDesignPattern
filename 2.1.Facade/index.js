//外观模式
//针对复杂的底层接口不统一的情况，我们需要提供一个更简单的高级接口，以供调用

//运用外观模式，实现对事件绑定的统一

function addEvent(dom,type,fn){
    //dom2级事件
    if(dom.addEventListener){
        dom.addEventListener(type,fn,false);
    }else if(dom.attachEvent){
        dom.attachEvent("on"+type,fn);
    }else{
        //都不支持采用dom 0级事件
        dom["on"+type] = fn;
    }
}


//当然，也可以通过外观模式来封装多个功能，简化底层操作方法。
