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