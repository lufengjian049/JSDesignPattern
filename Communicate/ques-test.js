function flatten(arr){
  var retarr = [];
  for(var i=0;i<arr.length;i++){
    if(Array.isArray(arr[i])){
      //retarr = [].concat.apply(retarr,flatten(arr[i]))
      retarr = retarr.concat(flatten(arr[i]));
    }else{
      retarr.push(arr[i]);
    }
  }
  return retarr;
}
//toString,只限int 数组，有字符串类型，会导致结果不正确
function flatten2(arr){
  return arr.toString().split(",").map(function(item){
    return +item;
  });
}
//reduce
function flatten3(arr){
  return arr.reduce(function(prev,current){
    return prev.concat(Array.isArray(current) ? flatten3(current) : current);
  },[]);
}
//...扩展运算符,每次都扁平化一层结构
function flatten4(arr){
  while(arr.some(item => Array.isArray(item))){
    arr = [].concat(...arr);
  }
  return arr;
}
function _flatten(input,shallow,strict,output){
  output = output || [];
  var idx = output.length;
  for(var i=0;i<input.length;i++){
    var value = input[i];
    if(Array.isArray(value)){
      if(shallow){
        var vlength = value.length,j=0;
        while(j<vlength) output[idx++] = value[j++];
      }else{
        _flatten(value,shallow,strict,output);
        idx = output.length;
      }
    }else{
      if(!strict){
        output[idx++] = value;
      }
    }
  }
  return output;
}
//test  [1,2,[3,4,[5,6,[7,8]]]]
// console.log(_flatten([1,2,[3,4,[5,6,[7,8]]]],false,true));
//union 并集,扁平化->去重
function _union(){
  return [...new Set(_flatten(arguments,true,true))];
}
console.log(_union([1,2,3],[101,2,1,10],4,5));
//diffence(array,*others) array中不同于others数组的元素
//差集
function _diffence(){
  var arr = arguments[0],
    others = [].slice.call(arguments,1);
  var flattened = _flatten(others,true,true);
  return arr.filter(function(item){
    return !~flattened.indexOf(item);
  });
}
console.log(_diffence([1, 2, 3, 4, 5], [5, 2, 10], [4], 3));
//shallow=false,strict=true; => []

//unique
function unique(arr){
  var map = new Map(),retarr=[];
  for(var i=0;i<arr.length;i++){
    var value = arr[i];
    if(!map.get(value)){
      map.set(value,true);
      retarr.push(value);
    }
  }
  return retarr;
}
function unique2(arr){
  return [...new Set(arr)];
}
function unique3(arr){
  return arr.filter(function(item,index){
    return arr.indexOf(item) == index;
  })
}
var testunique = [1,'2',undefined,undefined,'2',NaN,NaN,null,null,{},{},/a/,/a/,[],[]];
console.log(unique(testunique));
console.log(unique2(testunique));
console.log(unique3(testunique));
// < 0 (a come first) -1
// > 0 (b come first) 1 change
//compareFunction >0 change
var testarr = [5,3,7,1,4]
testarr.sort(function(a,b){
  if(a < b) return -1;
  if(a > b) return 1;
  return 0;
})
console.log(testarr);
function sub_curry(fn){
  var args = [].slice.call(arguments,1);
  return function(){
    args = args.concat([].slice.call(arguments));
    return fn.apply(this,args);
  }
}
function curry(fn,length){
  length = length || fn.length;
  // var args = [].slice.call(arguments,1);
  return function(){
    // args = args.concat([].slice.call(arguments));
    if(arguments.length < length){
      var combined = [fn].concat([].slice.call(arguments));
      return curry(sub_curry.apply(this,combined),length - arguments.length);
    }else{
      return fn.apply(this,arguments);
    }
  }
}
function _curry(fn,args){
  var length = fn.length;
  args = args || [];
  return function(){
    var _args = args.slice(0);
    for(var i=0;i<arguments.length;i++){
      _args.push(arguments[i]);
    }
    if(_args.length < length){
      return _curry.call(this,fn,_args);
    }else{
      return fn.apply(this,_args);
    }
  }
}
var _ = {};
function __curry(fn,args,holes){
  length = fn.length;
  args = args || [];
  holes = holes || [];
  return function() {
        var _args = args.slice(0),
            _holes = holes.slice(0),
            argsLen = args.length,
            holesLen = holes.length,
            arg, i, index = 0;

        for (i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            if (arg === _ && holesLen) {//第二次 以后的情况(第一次有占位了)
                index++;
                if (index > holesLen) {
                    _args.push(arg);
                    _holes.push(argsLen - 1 + index - holesLen);
                }
            }
            else if (arg === _) {
                _args.push(arg);
                _holes.push(argsLen + i);
            }
            else if (holesLen) {
                if (index >= holesLen) {
                    _args.push(arg);
                }
                else {
                    _args.splice(_holes[index], 1, arg);
                    _holes.splice(index, 1)
                }
            }
            else {
                _args.push(arg);
            }
        }
        if (_holes.length || _args.length < length) {
            return __curry.call(this, fn, _args, _holes);
        }
        else {
            return fn.apply(this, _args);
        }
    }
}
var testFn = function(a,b,c,d,e){
  return [a,b,c,d,e];
}
var curriedfn = _curry(testFn);
console.log(curriedfn(1,2)(3)(4,5));

var _fn = __curry(function(a, b, c, d, e) {
  console.log([a, b, c, d, e]);
});
// _fn(_, 2, 3, 4, 5)(1);
// fn(1, _, 3, 4, 5)(2);
// _fn(1, _, 3)(_, 4)(2)(5);
// _fn(1, _, _, 4)(_, 3)(2)(5);
_fn(_, 2)(_, _, 4)(1)(3)(5);
function partial(fn){
  var args = [].slice.call(arguments,1);
  return function(){
    return fn.apply(this,args.concat([].slice.call(arguments)));
  }
}
function _partial(fn){
  var args = [].slice.call(arguments,1);
  return function(){
    // var index = 0,newArgs=[];
    // for(var i=0;i<args.length;i++){
    //   if(args[i] == _){
    //     newArgs.push(arguments[index++]);
    //   }else{
    //     newArgs.push(args[i]);
    //   }
    // }
    // newArgs = newArgs.concat([].slice.call(arguments,index));
    // return fn.apply(this,newArgs);
    //优化，arguments用循环获取
    var index = 0,len = args.length;
    for(var i=0;i<len;i++){
      var curarg = args[i];
      args[i] = curarg == _ ? arguments[index++] : curarg; 
    }
    while(index < arguments.length){
      args[len++] = arguments[index++];
    }
    return fn.apply(this,args);
  }
}
var divide = function(a,b){
  return a / b;
}
var half = _partial(divide,_,2);
console.log('half',half(5));

//https://github.com/parro-it/awesome-micro-npm-packages