//数组，原生方法
//pop,push,shift,unshift,slice,sort,reverse,splice,concat,join
Array.prototype.indexOf = function(item,index){

}
Array.prototype.lastIndexOf = function(item,index){
    
}
function iterator(vars,body,ret){
    var fun = 'for(var '+ vars +'i=0,n=this.length;i<n,i++){' +
            body.replace('_','(( i in this) && fn.call(scope,this[i],i,this))') +
            '}' + ret
    return Function('fn,scope',fun)
}
//注意，在forEach等循环方法中，如【1，2，，4】这类数组，只遍历出3个值，所以要有 i in this 进行判断！！！！！！
//数组中 未定义的 undefined值，并不是一个 在数组中的属性值
Array.prototype.forEach = iterator()
Array.prototype.filter = iterator()
Array.prototype.map = iterator()
Array.prototype.some = iterator()
Array.prototype.every = iterator()

Array.prototype.reduce = function(fn,lastResult,scope){

}
Array.prototype.reduceRight = function(fn,lastResult,scope){
    var array = this.concat().reverse()
    return array.reduce(fn,lastResult,scope)
}
//扩展方法
function contains(target,item){

}
//移除指定元素，返回成功与否
function removeAt(target,index){

}
function remove(target,item){

}
//对数组进行洗牌，从后往前，取前面的随机位与最后一个交换，逐步往前...完成洗牌
function shuffle(target){

}
//从数组中随机选取一个元素
function random(target){

}
//扁平化处理，返回一个一维的新数组
function flatten(target){

}
//对数组进行去重
function unique(target){

}
//过滤数组中的null ，undefined，但不影响原数组
function compact(target){

}
//返回对象数组的指定属性值的数组
function pluck(target,name){
    
}
//根据指定条件进行分组(如回调或对象的某个属性)，构成对象进行返回
function groupBy(target,val){

}
//根据指定条件进行排序
function sortBy(target,fn,scope){

}
//对两个数组取并集
function union(target,array){

}
//交集
function intersect(target,array){

}
//补集
function diff(target,array){

}
//返回数组中最小的值
function min(target){

}
function max(target){

}

//splice
//pop push shift unshift