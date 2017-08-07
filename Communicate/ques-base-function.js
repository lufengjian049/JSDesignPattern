Function.prototype.bind = function(context){
    if(arguments.length < 2 && context == void 0){
        return this
    }
    var __method = this,args = [].slice.call(arguments,1)
    return function(){
        return __method.apply(context,args.concat.apply(args,arguments))
    }
}
var bind = function(bind){
    return {
        bind:bind.bind(bind),
        call:bind.bind(bind.call),
        apply:bind.bind(bind.apply)
    }
}(Function.prototype.bind)

// [].concat.apply([1,2],[[3,4]])
// bind.apply([].concat)([1,2],[[3,4]])

// Array.prototype.forEach.call(document.querySelectorAll(".klasses"), function(el){
//     el.addEventListener("click", someFunction);
// });

// var unboundForEach = Array.prototype.forEach,
//     forEach = Function.prototype.call.bind(unboundForEach);
 
// forEach(document.querySelectorAll(".klasses"), function (el) {
//     el.addEventListener("click", someFunction);
// });
Function.prototype.apply2 = function(x,y){
    x = x || window
    y = y || []
    x.__apply = this
    if(!x.__apply)
        x.constructor.prototype.__apply = this
    var r, j = y.length
    switch(j){
        case 0: r = x.__apply();break;
        case 1: r = x.__apply(y[0]);break;
        case 2: r = x.__apply(y[0],y[1]);break;
        //...
    }
    try{
        delete x.__apply ? x.__apply : x.constructor.prototype.__apply
    }catch(e) {}
    return r
}
console.log([].concat.apply2([1,2],[[3,4]]))
//concat
//切片 slice
//hasOwnProperty

//参数个数一致是执行，递归调用自身 来补全参数
function curry(fn){

}

//partial
//curry不足的参数是通过push进来补全的，而partial在定义时所有参数都已经有了，但某些位置的参数只是个占位符，我们接下来的传参只是替换掉它们
Function.prototype.partial = function(){

    return function(){

    }
}
// var _ = Object.create(null)


//apply call