//参与者模式
//在特定的作用域中执行给定的函数，并将参数原封不动的传递

//起因，事件的回调函数中添加 自定义参数

//第一版，通过绑定匿名函数 传递参数
dom.addEventListener(type,function(e){
    fn.call(dom,e,data);
},false);

//但是添加的回调函数 不能移除。。。。。

//函数绑定
function bind(fn,context){
    return function(){
        return fn.apply(context,arguments);
    }
}

//应用到事件中
var bindFn = bind(demoFn);
btn.addEventListener("click",bindFn);  //指向window

//目前已经可以 通过 removeEventListener移除事件了，还传递了 event参数

//接下来通过 函数柯理化 传递更多的参数，
//函数柯理化
function curry(fn){
    var Slice = [].slice;
    var args = Slice.call(arguments,1);
    return function(){
        var addArgs = Slice.call(arguments),
            allArgs = args.concat(addArgs);
        return fn.apply(null,allArgs);
    }
}
function add(num1,num2){
    return num1+num2;
}
var add5 = curry(add,5);
add5(7);

//重构bind
function bind(fn,context){
    var Slice = [].slice,
        args = Slice.call(arguments,2);

    return function(){
        var addArgs = Slice.call(arguments),
            allArgs = addArgs.concat(args);

        return fn.apply(context,allArgs);
    }
}

var bindFn = bind(demoFn,btn,{test:'test'});
btn.addEventListener("click",bindFn);


//兼容版本
if(Function.prototype.bind === void 0){
    Function.prototype.bind = function(context){
        var Slice = [].slice,
            args = Slice.call(arguments,1),
            that = this;
        return function(){
            var addArgs = Slice.call(arguments),
                allArgs = args.concat(addArgs);
            
            return that.apply(context,allArgs);
        }
    }
}

//反柯理化
Function.prototype.uncurry = function(){
    var that = this;
    return function(){
        return Function.prototype.call.apply(that,arguments);
    }
}

var toString = Object.prototype.toString.uncurry;
console.log(toString([]));
console.log(toString(function(){}));