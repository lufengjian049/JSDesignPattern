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