function toInteger(value) {
  var number = Number(value);
  if (isNaN(number)) { return 0; }
  if (number === 0 || !isFinite(number)) { return number; }
  return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
}
function sameequal(x,y){
  return x === y || (typeof x == 'number' && typeof y == 'number' && isNaN(x) && isNaN(y)); //处理NaN的情况
}
//fromIndex Math.max
function getIndex(len,index){
  //if index>=0 index else < 0 index+length <0 =0
  return Math.max(index >=0 ? index : len - Math.abs(index),0);
}
