//数组，原生方法
//pop,push,shift,unshift,slice,sort,reverse,splice,concat,join
Array.prototype.indexOf = function(item,index){
    var ret = -1,len = this.length,
    i = ~~index; //~~undefined == 0
    if(i < 0)
        i += index
    for(;i<len;i++){
        if(this[i] === item){  //完全匹配 才行!!!!!!
            ret = i;
            break
        }
    }
    return ret;
}
console.log("indexOf;",[1,2,3].indexOf(2))
console.log("indexOf;",[1,2,3].indexOf(2,1))
Array.prototype.lastIndexOf = function(item,index){
    var ret = -1,len = this.length,
    i = typeof index == 'undefined' ? len-1 : ~~index;
    if(i < 0)
        i = Math.max(0,n + i)
    for(;i>=0;i--){
        if(this[i] === item){
            ret = i;
            break
        }
    }
    return ret
}
console.log('lastIndexOf',[1,2,3,2,1].lastIndexOf(2))
console.log('lastIndexOf',[1,2,3,2,1].lastIndexOf(2,1))
function iterator(vars,body,ret){
    var fun = 'for(var '+ vars +'i=0,n=this.length;i<n;i++){' +
            body.replace('_','( i in this) && fn.call(scope,this[i],i,this)') +
            '}' + ret
    return Function('fn,scope',fun)
}
//注意，在forEach等循环方法中，如【1，2，，4】这类数组，只遍历出3个值，所以要有 i in this 进行判断！！！！！！
//数组中 未定义的 undefined值，并不是一个 在数组中的属性值
Array.prototype.forEach2 = iterator("","_","")
// [1,2,3].forEach2(function(item){
//     console.log(item)
// })
Array.prototype.filter2 = iterator('ret=[],','if(_){ret.push(this[i])}','return ret;')
console.log('filter',[1,2,3,4].filter2(function(item){
    return item > 2
}))
Array.prototype.map2 = iterator('ret=[],','ret.push(_ || undefined)','return ret')
console.log('map',[1,2,,4].map2(function(item){
    return item * 2
}))
Array.prototype.some2 = iterator('','if(_){return true}','return false')
console.log('some',[1,2,3,4].some2(function(item){
    return item > 4
}))
Array.prototype.every2 = iterator('','if(!(_)){return false}','return true')
console.log("every",[1,2,3,4].every2(function(item){
    return item > 2
}))
console.log("every",[1,2,3,4].every2(function(item){
    return item > 0
}))
Array.prototype.reduce2 = function(fn,lastResult,scope){
    //fn,
    if(this.length == 0)
        return lastResult
    var i = typeof lastResult == 'undefined' ? 1 : 0,
        len = this.length;
    lastResult = lastResult || this[0]
    for(;i<len;i++){
        lastResult = fn.call(scope,lastResult,this[i],i,this)
    }
    return lastResult
}
console.log('reduce',[1,2,3,4].reduce2(function(acc,item){
    return acc + item
},10))
Array.prototype.reduceRight2 = function(fn,lastResult,scope){
    var array = this.concat().reverse()
    return array.reduce2(fn,lastResult,scope)
}
console.log('reduceRight',[1,2,3,4].reduceRight2(function(acc,item){
    return acc + item
}))
//扩展方法
function contains(target,item){
    return !!~target.indexOf(item)
}
console.log('contains',contains([1,2],3))
console.log('contains',contains([1,2],1))
//移除指定元素，返回成功与否
function removeAt(target,index){
    var reArr = target.splice(index,1)
    return !!reArr.length
}
console.log('removeAt',removeAt([1,2,3,4],2))
console.log('removeAt',removeAt([1,2,3,4],4))
function remove(target,item){
    var index = target.indexOf(item)
    return ~index ? removeAt(target,index) : false
}
console.log('remove',remove([1,2,3,4],2))
console.log('remove',remove([1,2,3,4],0))
//对数组进行洗牌，从后往前，取前面的随机位与最后一个交换
function shuffle(target){
    var len = target.length,
        i = len - 1;
    for(;i>=0;i--){
        var ranindex = ~~(Math.random() * i)
        var tmp = target[i]
        target[i] = target[ranindex]
        target[ranindex] = tmp
    }
    return target
}
console.log('shuffle',shuffle([1,2,3,4,5]))
//从数组中随机选取一个元素
function random(target){
    return target[~~(Math.random() * target.length)]
}
console.log('random',random([1,2,3,4,5,6,7]))
//扁平化处理，返回一个一维的新数组
function flatten(target){
    var len = target.length,i=0,
        ret = [];
    for(;i<len;i++){
        if(Array.isArray(target[i])){
            ret = ret.concat(flatten(target[i]))
        }else{
            ret.push(target[i])
        }
    }
    return ret
}
console.log('flatten',flatten([1,2,[3,4,[5,6]]]))
//对数组进行去重
function unique(target){
    target = target && target.slice() //避免对原数组的影响
    var i = 0,j = 0,len = target.length;
    for(len = target.length;i<len;i++){
        for(j=i+1;j<len;j++){
            if(target[i] === target[j]){
                target.splice(j,1)
            }
        }
    }
    return target
}

console.log('unique',unique([1,2,3,1,2]))

//过滤数组中的null ，undefined，但不影响原数组
function compact(target){
    return target.filter(function(item){
        return item != null
    })
}
var target = [1,2,null,,undefined]
console.log('compact',compact(target))
console.log('target',target)
//返回对象数组的指定属性值的数组
function pluck(target,name){
    var len = target.length,i=0,ret=[];
    for(;i<len;i++){
        ret.push(target[i][name])
    }
    return ret
}
//根据指定条件进行分组(如回调或对象的某个属性)，构成对象进行返回
function groupBy(target,val){
    var callback = typeof val == 'function' ? val : function(obj){
        return obj[val]
    },retobj = {},len = target.length,i=0;
    for(;i<len;i++){
        var key = callback(target[i],i)
        // retobj[key] || (retobj[key] = [])
        // retobj[key].push(target[i])
        (retobj[key] || (retobj[key] = [])).push(target[i])
    }
    return retobj
}
//根据指定条件进行排序
function sortBy(target,fn,scope){
    var i = 0,len = target.length,compArr = target.map(function(item,index){
        return {
            el:item,
            comp:fn.call(scope,item,index)
        }
    })
    compArr.sort(function(x,y){
        // if(x.comp > y.comp){
        //     return 1
        // }else{
        //     return -1
        // }
        var a = x.comp,b = y.comp;
        return a > b ? 1 : a < b ? -1 : 0
    })
    return pluck(compArr,"el")
}
console.log('sortBy',sortBy([{'age':21},{'age':11},{'age':31}],function(item,index){
    return item.age
}))
//对两个数组取并集
function union(target,array){
    return unique(target.concat(array))
}
console.log('union',union([1,2,3],[2,3,4]))
//交集
function intersect(target,array){
    return target.filter(function(item){
        return contains(array,item)
    })
}
console.log('intersect',intersect([1,2,3,4,6],[3,5,6]))
//补集
function diff(target,array){

}
//返回数组中最小的值
function min(target){
    return Math.min.apply(0,target)
}
function max(target){
    return Math.max.apply(0,target)
} 

//splice
//pop push shift unshift