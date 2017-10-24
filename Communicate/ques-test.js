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

// function isObj(obj){
//   return Object.prototype.toString.call(obj) == '[object Object]';
// }
var toString = Function.call.bind(Object.prototype.toString);
function isObj(obj){
  return toString(obj) == '[object Object]';
}
function originzipmap(keys,vals){
  return keys.reduce(function(acc,key,index){
    acc[key] = vals[index];
    return acc;
  },{});
}
function zipmapPairs(arr){
  return arr.reduce(function(acc,item){
    acc[item[0]] = item[1];
    return acc;
  },{});
}
function zipmapObjs(arr){
  return arr.reduce(function(acc,item){
    acc[item.key] = item.value;
    return acc;
  },{});
}
function zipmap(keys,vals){
  if(!vals){
    if(Array.isArray(keys) && !keys.length) return {};
    if(Array.isArray(keys[0])) return zipmapPairs(keys);
    if(isObj(keys[0])) return zipmapObjs(keys);
    throw new TypeError("error");
  }
  return originzipmap(keys,vals);
}
console.log(zipmap(['a', 'b', 'c'],[1,2,3]));
console.log(zipmap([
  { key: 'foo', value: 'bar' },
  { key: 'hi', value: 'bye' },
]));
console.log(zipmap([
  ['foo', 'bar'],
  ['hi', 'bye']
]));
//基本类型到引用类型，还有date
// function deepEqual1(actual,expected,opts){
//   var akeys = Object.keys(obja),
//       bkeys = Object.keys(objb);
//   if(akeys.length != bkeys.length){
//     return false;
//   }else{
//     for(var i=0;i<akeys.length;i++){
//       var curkey = akeys[i];
//       if(obja[curkey] != objb[curkey]){
//         return false;
//       }
      
//     }
//   }
// }
//1.基本类型值===直接返回
//2.都是基本类型值得判断
//3.都是时间格式的判断
//4.统一都作对象处理(也处理了类型不一样的情况)
//都是对象的处理，key的长度，排序后，key是否都相同,在比较value
function deepEqual(actual,expected,opts){
  if(!opts) opts = {};
  if(actual === expected){
    return true;
  }else if(actual instanceof Date && expected instanceof Date){
    return actual.getTime() == expected.getTime();
  }else if(!actual || !expected || typeof actual != 'object' && typeof expected != 'object'){
    return opts.strict ? actual === expected : actual == expected;
  }else{
    return objEqual(actual,expected,opts);
  }
}
function isUndefinedOrNull(value){
  return value === undefined || value === null;
}
function isArgument(obj){
  return toString(obj) == "[object Argument]";
}
function objEqual(a,b,opts){
  if(isUndefinedOrNull(a) || isUndefinedOrNull(b)){
    return false;
  }
  if(a.prototype != b.prototype) return false;
  if(isArgument(a)){
    if(!isArgument(b)){
      return false;
    }
    a = Array.prototype.slice(a);
    b = Array.prototype.slice(b);
    return deepEqual(a,b,opts);
  }
  var ka,kb;
  try{
    ka = Object.keys(a);
    kb = Object.keys(b);
  }catch(e){
    return false;
  }
  if(ka.length != kb.length){
    return false;
  }
  ka.sort();
  kb.sort();
  //key is or not equal??
  for(var i = ka.length-1;i>=0;i--){
    if(ka[i] != kb[i]){
      return false;
    }
  }
  for(i = ka.length - 1;i>=0;i--){
    var key = ka[i];
    if(!deepEqual(a[key],b[key],opts)) return false;
  }
  return typeof a === typeof b;
}
deepEqual(new Date(),32);
var hasOwn = Function.call.bind(Object.prototype.hasOwnProperty);
function deepAssign(target,sources){
  target = Object(target);
  for(var index = 1;index<arguments.length;index++){
    var source = arguments[index];
    assign(target,source);
  }
  return target;
}
function assign(to,from){
  if(to === from){
    return to;
  }
  from = Object(from);
  for(var key in from){
    if(hasOwn(from,key)){
      var val = from[key];
      if(val === null || val === undefined){
        return;
      }
      if(!hasOwn(to,key) || !isObj(val) || !isObj(to[key])){
        to[key] = val;
      }else{
        to[key] = assign(Object(to[key]),from[key]);
      }
    }
  }
  return to;
}
console.log(deepAssign({a:2},{a:{b:2}},{a:{c:3}}));
//npm split-string https://www.npmjs.com/package/split-string
//'a.b'.c "a.b".c (a.b).c
function setValue(obj,props,val){
  // var propArr = props.match(/['"(\[<{]?([^'"(\[<{]+)['"(\[<{]?\.?/g);
  // 纵向分组 也会匹配出 undefined; ！！！！  转义
  // 对象的合并，extend进来的&&绑定的属性也是对象，需要extend一下
  var reg = /(['"(\[<{]([^'"(\[<{]+)['")\]>}]|([^\.]+))\.?/g,
      matchedprop,
      addedobj = obj;
  while(matchedprop = reg.exec(props)){
    var addkey = matchedprop[2] || matchedprop[3];
    if(matchedprop[1] === addkey)
      addedobj[addkey] = val;
    else{
      addedobj[addkey] = {};
      addedobj = addedobj[addkey];
    }
  }
  return obj;
  // obj[matchedprop] = val;
}
console.log(setValue({},'a\\.b\\.c',3));

function hasDeepKey(keys,obj){
  if(typeof obj == 'undefined'){
    return function(o){
      return hasKeyDeep(keys,o);
    }
    return hasKeyDeep(keys,obj);
  }
}
//keys -> array 递归遍历
function hasKeyDeep(keys,obj){
  if(typeof keys == 'string'){
    return hasKeyDeep(keys.split("."),obj);
  }
  if(keys.length === 0){
    return true;
  }
  if(keys.length  === 1){
    return obj !== null && obj.hasOwnProperty(keys[0]);
  }
  if(obj.hasOwnProperty(keys[0])){
    return hasKeyDeep(keys.slice(1),obj[keys[0]]);
  }
  return false;
}
var keysarr = [];
function flattenKeys(obj,opts){
  opts = Object.assign({sep:'_',snake:true,filter:String.prototype.toLowerCase},opts);
  for(var key in obj){
    if(obj.hasOwnProperty(key)){
      var val = obj[key],
          parentkey = [key];
      keysarr.push(parentkey.slice());
      if(isObj(val)){
        getKeys(parentkey,obj[key]);
      }
    }
  }
  console.log(keysarr);
}
function getKeys(parentkey,curobj){
  if(curobj){
    for(var key in curobj){
      if(curobj.hasOwnProperty(key)){
        var val = curobj[key];
        parentkey.push(key);
        keysarr.push(parentkey.slice());
        if(isObj(val)){
          getKeys(parentkey,curobj[key]);
        }
      }
    }
  }
}
flattenKeys({zero:{one:1,second:{third:3}},test:0});

//https://github.com/parro-it/awesome-micro-npm-packages