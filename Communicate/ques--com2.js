//修改下John Resig的经典class

var Class = (function(){
    var _mix = function(target,sub){
      for(var key in sub){
        if(sub.hasOwnProperty(key)){
          target[key] = sub[key]
        }
      }
      return target
    }
    var initial = false
    var _extend = function(){
      initial = true
      var superproto = new this()
      initial = false
      //防止再初始化 父类的构造
      var items = [].slice.call(arguments) || [],item;
      while(item = items.shift())
        _mix(superproto,item.prototype || item)
      // items.forEach(function(item){
      //   _mix(superproto,item.prototype || item)
      // })
      //子类
      function subClass(){
        if(!initial && this.init){
          this.init.apply(this,arguments)
        }
      }
      subClass.extend = _extend
      subClass.prototype = superproto
      subClass.prototype.constructor = subClass
      return subClass
    }
    //超级父类
    function Class(){}
    Class.extend = _extend
    return Class
  }
)()

var Animal = Class.extend({
  init:function(opts){
    this.msg = opts.msg
    this.type = "animal"
  },
  say:function(){
    console.log(this.msg+":i am a "+this.type)
  }
})

var Dog = Animal.extend({
  init:function(opts){
    //并未实现super方法，直接简单使用父类原型调用即可
    Animal.prototype.init.call(this,opts)
    this.type = "dog"
  }
})

new Dog({msg:'hi'}).say()

var textCount = Class.extend({
  init:function(config){
    this.input = $("#"+config.id)
    this._bind()
    this.render()
  },
  _bind:function(){
    this.input && this.input.on('keyup',() =>{
      this.render()
    })
  },
  getNum:function(){
    return this.input.val().length
  },
  render:function(){
    var num = this.getNum();
    if ($('#J_input_count').length == 0) {
      this.input.after('<span id="J_input_count"></span>');
    };
    $('#J_input_count').html(num+'个字');
  }
})
// $(function(){
//   new textCount({
//     id:"#input_id"
//   })
// })

//组件的公用部分
// 比如init用来初始化属性。
// 比如render用来处理渲染的逻辑。
// 比如bind用来处理事件的绑定。
//抽象base类

var Base = Class.extend({
  init:function(config){
    this._config = config
    this.bind()
    this.render()
  },
  get:function(key){
    return this._config[key]
  },
  set:function(key,value){
    this._config[key] = value
  },
  bind:function(){},
  render:function(){},
  destory:function(){}
})
var textCount2 = Base.extend({
  bind:function(){
    // this.get('input') && this.get('input').on('keyup',() =>{
    //   this.render()
    // })
    console.log('bind',this.get('input'))
  },
  getNum:function(){
    return this.get('input').val().length
  },
  render:function(){
    // var num = this.getNum();
    // if ($('#J_input_count').length == 0) {
    //   this.get('input').after('<span id="J_input_count"></span>');
    // };
    // $('#J_input_count').html(num+'个字');
    console.log('render',this.get('input'))
  }
})
// $(function(){
  //必须要传配置项了
  new textCount2({
    input:'inputid'
  })
// })
//输入超过5个字符时，给警告。。。
//可以在bind事件里面，判断字符长度，但是这样耦合太严重
//观察者模式，通知与监听

//fire用来触发一个事件，可以传递数据。而on用来添加一个监听。这样组件里面只负责把一些关键的事件抛出来，至于具体的业务逻辑都可以添加监听来实现。没有事件的组件是不完整的

var Event = Class.extend({
  on:function(eventname,listener){
    this._events || (this._events = {})
    this._events[eventname] || (this._events[eventname] = [])
    if(!~this._events[eventname].indexOf(listener) && typeof listener === 'function'){
      this._events[eventname].push(listener)
    }
    return this
  },
  fire:function(eventname){
    if(!this._events || !this._events[eventname])
      return
    var args = [].slice.call(arguments,1),listener;
    this._events[eventname].forEach(function(listener){
      listener.apply(this,args)
    })
    // while(listener = this._events[eventname].shift())
    //   listener.apply(this,args)
    return this
  },
  off:function(eventname,listener){
    console.log("off",eventname)
    if(!eventname && !listener)
      this._events = {}
    if(eventname && !listener)
      delete this._events[eventname]
    if(eventname && listener){
      var index = this._events[eventname].indexOf(listener)
      ~index && (this._events[eventname].splice(index,1))
    }
    return this
  }
})
var event = new Event();
var test1 = function(str){
  console.log('1',str)
}
var test2 = function(str){
  console.log('2',str)
}
event.on('test',test1)
event.on('test',test2)
event.fire("test",'teststr').off("test",test1).fire("test",'off after')

//将event放入我们的base中，让子类都具有事件功能

var Base = Class.extend(Event,{
  //...
  destory:function(){
    //销毁所有监听
    this.off()
  }
})
//有了事件机制我们可以把组件内部很多状态暴露出来，比如我们可以在set方法中抛出一个事件，这样每次属性变更的时候我们都可以监听到

// var TextCount = Base.extend({
//   ...
//   bind:function(){
//     var self = this;
//     self.get('input').on('keyup',function(){
//       //通知,每当有输入的时候，就报告出去。
//       self.fire('Text.input',self._getNum())
//       self.render();
//     });
//   },
//   ...
// })

// $(function() {
//   var t = new TextCount({
//     input:$("#J_input")
//   });
//   //监听这个输入事件
//   t.on('Text.input',function(num){
//     //可以获取到传递过来的值
//     if(num>5){
//        alert('超过了5个字了。。。')
//     }
//   })
// })

//配置名，事件名？？
//getter setter