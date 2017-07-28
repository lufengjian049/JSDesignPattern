//类工厂
(function(){
  //initializing是为了解决我们之前说的继承导致原型有多余参数的问题。当我们直接将父类的实例赋值给子类原型时。是会调用一次父类的构造函数的。
  //所以这边会把真正的构造流程放到init函数里面，通过initializing来表示当前是不是处于构造原型阶段，为true的话就不会调用init。
  //fnTest用来匹配代码里面有没有使用super关键字。对于一些浏览器`function(){xyz;}`会生成个字符串，并且会把里面的代码弄出来，有的浏览器就不会。
  //`/xyz/.test(function(){xyz;})`为true代表浏览器支持看到函数的内部代码，所以用`/\b_super\b/`来匹配。如果不行，就不管三七二十一。所有的函数都算有super关键字，于是就是个必定匹配的正则。
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // 超级父类
  this.Class = function(){};
 
  // 生成一个子类，这个类会具有extend方法用于继续继承下去
  Class.extend = function(prop) {
    //this指向父类原型方法，初始时Class
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    //开关 用来使原型赋值时不调用真正的构成流程
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    for (var name in prop) {
      //将prop混入到子类原型上，function做些特殊处理
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          //通过闭包，返回一个新的操作函数.在外面包一层，这样我们可以做些额外的处理
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            // 调用一个函数时，会给this注入一个_super方法用来调用父类的同名方法
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            //因为上面的赋值，是的这边的fn里面可以通过_super调用到父类同名方法
            var ret = fn.apply(this, arguments);  
            //离开时 保存现场环境，恢复值。
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
    //子类
    function Class() {
      //init作初始，父类调用init
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    //为子类再添加静态方法，以便extend下去
    Class.extend = arguments.callee;
    return Class;
  };
})();

var Person = Class.extend({
  init: function(isDancing){
    this.dancing = isDancing;
  },
  dance: function(){
    return this.dancing;
  }
});
var p = new Person(true);
console.log(p.dance()); // => true
p.init(false) //还可以在改 init 。。。。。
console.log(p.dance())


var Ninja = Person.extend({
  init: function(){
    this._super( false );
  },
  // dance: function(){
  //   // Call the inherited version of dance()
  //   return this._super();
  // },
  swingSword: function(){
    return true;
  }
});
var n = new Ninja();
console.log(n.dance()); // => false
n.swingSword(); // => true