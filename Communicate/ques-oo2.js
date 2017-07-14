//阿拉蕾
// The base Class implementation.
function Class(o) {
  //这个判断用来支持 将一个已有普通类转换成 阿拉蕾的类
  if (!(this instanceof Class) && isFunction(o)) {
    //原理是给这个函数增加extend，implement方法
    return classify(o)
  }
}
//用来支持 commonjs的模块规范。
module.exports = Class


// Create a new Class.
//
//  var SuperPig = Class.create({
//    Extends: Animal,
//    Implements: Flyable,
//    initialize: function() {
//      SuperPig.superclass.initialize.apply(this, arguments)
//    },
//    Statics: {
//      COLOR: 'red'
//    }
// })
//
//

//用于创建一个类，
//第一个参数可选，可以直接创建时就指定继承的父类。
//第二个参数也可选，用来表明需要混入的类属性。有三个特殊的属性为Extends,Implements,Statics.分别代表要继承的父类，需要混入原型的东西，还有静态属性。
Class.create = function(parent, properties) {
  if (!isFunction(parent)) {
    properties = parent
    parent = null
  }

  properties || (properties = {})
  parent || (parent = properties.Extends || Class)
  properties.Extends = parent

  function SubClass() {
    parent.apply(this, arguments)

    if (this.constructor === SubClass && this.initialize) {
      this.initialize.apply(this, arguments)
    }
  }

  if (parent !== Class) {
    //混入父类 静态属性
    mix(SubClass, parent, parent.StaticsWhiteList)
  }
  //混入原型，有静态属性，也混入
  implement.call(SubClass, properties)

  //给生成的子类增加extend和implement方法
  return classify(SubClass)
}

//用于在类定义之后，往类里面添加方法
function implement(properties) {
  var key, value

  for (key in properties) {
    value = properties[key]
    //发现属性是特殊的值时，调用对应的处理函数处理
    if (Class.Mutators.hasOwnProperty(key)) {
      Class.Mutators[key].call(this, value)
    } else {
      this.prototype[key] = value
    }
  }
}

Class.extend = function(properties) {
  properties || (properties = {})
  //很巧妙
  properties.Extends = this
  return Class.create(properties)
}

//给一个普通的函数 增加extend和implement方法。
function classify(cls) {
  cls.extend = Class.extend
  cls.implement = implement
  return cls
}


Class.Mutators = {
  'Extends': function(parent) {
    //父类 原型混入
    var existed = this.prototype
    var proto = createProto(parent.prototype)
    mix(proto, existed)
    proto.constructor = this
    this.prototype = proto
    this.superclass = parent.prototype
  },
  'Implements': function(items) {
    //组合 混入原型
    isArray(items) || (items = [items])
    var proto = this.prototype, item
    while (item = items.shift()) {
      mix(proto, item.prototype || item)
    }
  },
  'Statics': function(staticProperties) {
    mix(this, staticProperties)
  }
}


// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {
}

var createProto = Object.__proto__ ?
    function(proto) {
      return { __proto__: proto }
    } :
    function(proto) {
      Ctor.prototype = proto
      return new Ctor()
    }

function mix(r, s, wl) {
  // Copy "all" properties including inherited ones.
  for (var p in s) {
    //过滤掉原型链上面的属性
    if (s.hasOwnProperty(p)) {
      if (wl && indexOf(wl, p) === -1) continue

      // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
      if (p !== 'prototype') {
        r[p] = s[p]
      }
    }
  }
}


var toString = Object.prototype.toString

var isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]'
}

var isFunction = function(val) {
  return toString.call(val) === '[object Function]'
}

var indexOf = Array.prototype.indexOf ?
    function(arr, item) {
      return arr.indexOf(item)
    } :
    function(arr, item) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === item) {
          return i
        }
      }
      return -1
    }
