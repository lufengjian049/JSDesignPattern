//对象扩展
function keys(obj){
    var a = []
    for(a[a.length] in obj);
    return a;
}
function mixin(target,source){
    //TODO:
    return target
}
//数组化，将类数组转化为数组，因[].slice.call在IE会报错。。。所以要做些兼容
var toArray = function(){
    return window.VBArray ? function(a,start,end,res){

    } : function(a,start,end){

    }
}()
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

//...

//domready




