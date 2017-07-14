//无new链式调用，委托模式
var query = {
  init:function(selector){
    this[0] = document.querySelector(selector)
    this.length = 1
    return this
  },
  html:function(){
    console.log('html method',this[0].innerHTML)
    return this;
  },
  css:function(){
    console.log('css method',this[0].style)
    return this
  }
}
//扩展方法
query.extend = function(){
  var i = 1,
      len = arguments.length,
      target = arguments[0],
      j;
  if( i == len){
    target = this;
    i--
  }
  for(;i<len;i++){
    for(j in arguments[i]){
      target[j] = arguments[i][j]
    }
  }
  return target
}

var q1 = Object.create(query)
query.extend({
  test:function(){
    console.log('test extend method')
    return this
  }
})
q1.init("#ticket-booking-coupon").test().html().css()

//无new链式调用，原型模式
function power(selector){
  return new power.init(selector)
}
power.fn = power.prototype = {
  constructor: power,
  init: function(selector){
    this[0] = document.querySelector(selector)
    this.length = 1
    return this
  }
}
//扩展方法只能在 power.prototype.init.prototype上面 ....
power.prototype.init.prototype = power.fn
//扩展
power.extend = power.fn.extend = function(){
  var i = 1,
      len = arguments.length,
      target = arguments[0],
      j;
  if( i == len){
    target = this;
    i--
  }
  for(;i<len;i++){
    for(j in arguments[i]){
      target[j] = arguments[i][j]
    }
  }
  return target
}
power.fn.extend({
  html:function(){
    return this
  },
  css:function(){
    return this
  }
})