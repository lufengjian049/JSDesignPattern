//迭代器模式
//顺序访问聚合对象内部的元素

var Iterator = function(items,container){
    var container = container && document.getElementById(container) || document,
        items = container.getElementByTagName(items),
        length = items.length,
        index = 0;
    
    // 缓存 源生数组splice方法
    var splice = [].splice;

    return {
        first:function(){},
        second:function(){},
        pre:function(){},
        next:function(){},
        get:function(){},
        //对每一个元素执行某一个方法
        dealEach:function(){},
        //对某一个元素执行某一方法
        dealItem:function(){},
        //排他方式处理某一元素
        exclusive:function(){}
    }
}

//数组迭代器
var eachArray = function(arr,fn){
    var i = 0,
        len = arr.length;
    for(;i<len;i++){
        if(fn.call(arr[i],i,arr[i]) === false){
            break;
        }
    }
}