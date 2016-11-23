//装饰者模式
//在不改变原对象的基础上，通过对其包装拓展，使原对象满足更复杂的需求

//装饰已有的对象

var decorator = function(input,fn){
    var input = document.getElementById("input");

    if(typeof input.onclick === "function"){
        var oldClickFn = input.onclick;
        input.onclick = function(){
            oldClickFn();
            fn();
        }
    }else{
        input.onclick = fn;
    }
}