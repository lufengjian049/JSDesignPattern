//对象扩展
function keys(obj){
    var a = []
    for(a[a.length] in obj);
    return a;
}
//最后一个bool值，是否覆盖同名属性
function mixin(target,source){
    var args = [].slice.call(arguments),
        length = args.length,
        i = 1,
        key,
        //是否覆写
        ride = typeof args[length - 1] == 'boolean' ? args.pop() : true;
    if(args.length == 1){
        target = this.window ? {} : this
        i = 0
    }
    while((sitem = args[i++])){
        for(key in sitem){
            if(ride || !(key in target))
                target[key] = sitem[key]
        }
    }
    return target
}
console.log(mixin({"t":1},{"t":2},{"q":11},false))
//数组化，将类数组转化为数组，因[].slice.call在IE会报错。。。所以要做些兼容
//IIFE的好处是一开始就知道浏览器类型
var toArray = function(){ //window.VBArray
    return typeof window != 'undefined' && window.VBArray ? function(a,start,end){
        var ret = [],len = a.length;
        start = start || 0
        end = end || len
        start < 0 && (start += len)
        end < 0 && (end += len)
        end > len && (end = len)
        for(var i = start;i< end;i++){
            ret[i-start] = a[i]
        }
        return ret
    } : function(a,start,end){
        return [].slice.call(a,start || 0,end || len)
    }
}()
console.log(toArray([1,2,3,4,5,6],2,5))
//类型判断
//判断是否是ie？
// typeof document.all //chrome undefined
function isNaN(obj){
    return obj !== obj
}
function isNull(obj){
    return obj === null
}
function isUndefined(obj){
    return obj === void 0
}
//早年的isArray判断，未有object.prototype.toString
function isArray(arr){
    // return arr instanceof Array
    // return !!arr && arr.constructor == Array
    // return typeof arr.sort == 'function'
    // return !!arr && typeof arr === 'object' && 'splice' in arr && 'join' in arr;
    // ...
}
//ie678
// window == document //ie678 true
// document == window //ie678 false
//纯对象，不是dom，bom，也不是自定义类的实例对象
function isPlainObject(obj){
    return obj && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype
}
var class2type = {
    "[object HTMLDocument]": "Document",
    "[object HTMLCollection]": "NodeList",
    "[object StaticNodeList]": "NodeList",
    "[object DOMWindow]": "Window",
    "[object global]": "Window",
    "null": "Null",
    "NaN": "NaN",
    "undefined": "Undefined"
}
///[^, ]+/g
"Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList".replace(/[^, ]+/g, function(name) {
    class2type["[object " + name + "]"] = name;
})
var serialize = class2type.toString;
function type(obj){
    var result = class2type[(obj == null || obj !== obj) ? obj : serialize.call(obj)] || obj.nodeName || '#'
    return result
}
console.log(type(new String('dsdsd')))
// console.log(class2type)

//...

//domready




