//监听数组变化 https://my.oschina.net/qiangdada/blog/911252

//监听数组变化
var arrayProto = Array.prototype;
var arrayMethod = Object.create(arrayProto);
var newArrayProto = {};

[
    'push',
    'pop',
    'unshift',
    'shift'
].forEach((method) => {
    var origin = arrayMethod[method];
    newArrayProto[method] = function(){
        console.log("array data has changed!!!!");
        origin.apply(this,arguments);
    }
})

var arr=[1,2,3]
arr.__proto__ = newArrayProto;

arr.push(4);


//es6实现
class newArray extends Array{
    constructor(...args){
        super(...args);
    }
    push(...args){
        console.log("array data has changed!!!");
        return super.push(...args);
    }
}
var list = [1,2,3]
var newlist = new newArray(...list);
newlist.push(4);

//prototype继承
function inheritObject(o){
    //声明一个过渡函数
    function F(){}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subClass,superClass){
    //复制一份父类的原型对象
    var p = inheritObject(superClass.prototype);
    //修正因为重写子类原型导致constructor指向父类
    p.constructor = subClass;
    subClass.prototype = p;
}
function ArrayOfMine(args){
    Array.apply(this,args);
}
inheritPrototype(ArrayOfMine,Array);
ArrayOfMine.prototype.push = function(){
    console.log('array data has changed');
    return Array.prototype.push.apply(this,arguments);
}
var list1 = [1,2];
var newlist1 = new ArrayOfMine(list1);
console.log(newlist1,newlist1.length)
newlist1.push(3);
console.log(newlist1,newlist1.length)
//有问题

//改
function inheritObject(o){
    function F(){}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subClass,superClass){
    var p = inheritObject(superClass.prototype);
    p.constructor = subClass;
    subClass.prototype = p;
}
function ArrayOfMine () {
  var args = arguments
    , len = args.length
    , i = 0
    , args$1 = [];   // 保存所有arguments
  for (; i < len; i++) {
    // 判断参数是否为数组，如果是则直接concat
    if (Array.isArray(args[i])) {
      args$1 = args$1.concat(args[i]);
    }
    // 如果不是数组，则直接push到
    else {
      args$1.push(args[i])
    }
  }
  // 接收Array.apply的返回值，刚接收的时候arr是一个Array
  var arr = Array.apply(null, args$1);
  // 将arr的__proto__属性指向 ArrayOfMine的 prototype
  arr.__proto__ = ArrayOfMine.prototype;
  return arr;
}
inheritPrototype(ArrayOfMine,Array);
ArrayOfMine.prototype.push = function(){
    console.log('array data has changed');
    return Array.prototype.push.apply(this,arguments);
}
var list1 = [1,2];
var newlist1 = new ArrayOfMine(list1);
console.log(newlist1,newlist1.length)
newlist1.push(3);
console.log(newlist1,newlist1.length)

//终极
// Define Property
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    configurable: true,
    writable: true
  })
}
// observe array
let arrayProto = Array.prototype;
let arrayMethods = Object.create(arrayProto);
[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
].forEach(method => {
  // 原始数组操作方法
  let original = arrayMethods[method];
  def(arrayMethods, method, function () {
    let arguments$1 = arguments;
    let i = arguments.length;
    let args = new Array(i);

    while (i--) {
      args[i] = arguments$1[i]
    }
    // 执行数组方法
    let result = original.apply(this, args);
    // 因 arrayMethods 是为了作为 Observer 中的 value 的原型或者直接作为属性，所以此处的 this 一般就是指向 Observer 中的 value
    // 当然，还需要修改 Observer，使得其中的 value 有一个指向 Observer 自身的属性，__ob__，以此将两者关联起来
    let ob = this.__ob__;
    // 存放新增数组元素
    let inserted;
    // 为add 进arry中的元素进行observe
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // 第三个参数开始才是新增元素
        inserted = args.slice(2);
        break;
    }
    if (inserted) {
      ob.observeArray(inserted);
    }
    // 通知数组变化
    ob.dep.notify();
    // 返回新数组长度
    return result;
  })

})
