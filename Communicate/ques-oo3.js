//P.js
var P = (function(prototype, ownProperty, undefined) {
  return function P(_superclass /* = Object */, definition) {
    // handle the case where no superclass is given
    if (definition === undefined) {
      definition = _superclass;
      _superclass = Object;
    }

    function C() {
      var self = this instanceof C ? this : new Bare;
      self.init.apply(self, arguments);
      return self;
    }

    function Bare() {}
    C.Bare = Bare;

    //这边prototype就是个字符串“prototype”变量，主要为了压缩字节少点
    var _super = Bare[prototype] = _superclass[prototype];
    var proto = Bare[prototype] = C[prototype] = C.p = new Bare;
    
    var key;
    proto.constructor = C;
    C.extend = function(def) { return P(C, def); }
    //function自执行，return C,C.open = C
    return (C.open = function(def) {
      if (typeof def === 'function') {
        def = def.call(C, proto, _super, C, _superclass);
      }

      // 如果是对象，就直接混入到原型
      if (typeof def === 'object') {
        for (key in def) {
          if (ownProperty.call(def, key)) {
            proto[key] = def[key];
          }
        }
      }

      //确保有init函数
      if (!('init' in proto)) proto.init = _superclass;

      return C;
    })(definition);
  }

})('prototype', ({}).hasOwnProperty);



var Animal = P(function(animal) {
  animal.init = function(name) { this.name = name; };

  animal.move = function(meters) {
    console.log(this.name+" moved "+meters+"m.");
  }
});
var Snake = P(Animal, function(snake, animal) {
  snake.move = function() {
    console.log("Slithering...");
    animal.move.call(this, 5);
  };
});

var Horse = P(Animal, function(horse, animal) {
  //真正的私有属性，外面没法调用到
  var test = "hello world";
  horse.move = function() {
    console.log(test);
    console.log("Galloping...");
    //调用父类的方法，so easy！！
    animal.move.call(this, 45);
  };
});
//工厂方式生成对象，可以不用new
var sam = Snake("Sammy the Python")
  , tom = Horse("Tommy the Palomino")
;

sam.move()
tom.move()