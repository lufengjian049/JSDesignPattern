//最初的实现
function Animal(name){
  this.name = name;
}
Animal.prototype.run = function(){
  console.log(this.name+ " is running....")
}

// function Dog(name){
//   Animal.call(this,name)
// }
// Dog.prototype = new Animal()

// var dog1 = new Dog('test')
// dog1.run()

//几个问题，子类的prototype直接为 父类的对象，简单粗暴会有多余属性name
//子类的constructor也不对

//改良,解决上面的两个问题
// var F = function(){}
// F.prototype = Animal.prototype
// Dog.prototype = new F()
// Dog.prototype.constructor = Dog

//简单封装
function objectCreate(prototype){
  var F = function(){}
  F.prototype = prototype
  return new F()
}
function inherit(subclass,parentclass){
  subclass.prototype = objectCreate(parentclass.prototype)
  subclass.prototype.constructor = subclass
}
function Dog(name){
  Animal.call(this,name)
}
inherit(Dog,Animal)
var dog2 = new Dog("haha")
dog2.run()
//子类构造函数中还是会调用父类的call方法，最好可以改下

//改良--
//加上 constructor参数
function protoCreate(prototype,constructor){
  var F = function(){}
  F.prototype = prototype
  var newpro = new F()
  newpro.constructor = constructor
  return newpro
}
//简单实现混入
function mix(target,sub){
  for(var key in sub){
    if(sub.hasOwnProperty(key)){
      target[key] = sub[key]
    }
  }
  return target
}
//protomix 混入子类原型，staticmix 混入子类函数，就是静态方法
function extend(subclass,parentclass,protomix,staticmix){
  if(!subclass || !parentclass)
    return
  var superproto = parentclass.prototype
  var subproto = protoCreate(superproto,subclass)
  //可以获取父类的构造函数---指向父类对象 比较巧妙
  subclass.superclass = protoCreate(superproto,parentclass)
  //混入原子类的原型
  subclass.prototype = mix(subproto,subclass.prototype)
  if(protomix){
    mix(subproto,protomix)
  }
  if(staticmix){
    mix(subclass,staticmix)
  }
  return subclass
}
function Dog2(name){
  Dog2.superclass.constructor.call(this,name)
}
extend(Dog2,Animal,{
  wang:function(){
    console.log("wang wang")
  }
},{
  statictest:function(){
    console.log("static test method。。。")
  }
})
var dog3 = new Dog2("dog3")
dog3.run()
dog3.wang()
Dog2.statictest()






