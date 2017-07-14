//比如我们要实现这样一个组件，就是一个输入框里面字数的计数
 $(function() {

  var input = $('#J_input');

  //用来获取字数
  function getNum(){
    return input.val().length;
  }

  //渲染元素
  function render(){
    var num = getNum();

    //没有字数的容器就新建一个
    if ($('#J_input_count').length == 0) {
      input.after('<span id="J_input_count"></span>');
    };

    $('#J_input_count').html(num+'个字');
  }

  //监听事件
  input.on('keyup',function(){
    render();
  });

  //初始化，第一次渲染
  render();


})
//最简陋，变量混乱，没有隔离作用域

var textCount = {
  input:null,
  init:function(config){
    this.input = $("#"+config.id)
    this.bind()
    return this
  },
  bind:function(){
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
}
$(function(){
  textCount.init({id:"J_input"}).render()
})
//方法都统一在一个作用域下管理
//问题是 没有私有的概念。会被篡改

var textCount2 = (function(){
  var _bind = function(that){
    that.input && that.input.on('keyup',() =>{
        that.render()
    })
  }
  var _getNum = function(that){
    return that.input.val().length
  }
  function TextCountFunc(config){

  }
  TextCountFunc.prototype.init = function(config){
    this.input = $("#"+config.id)
    _bind(this)
    return this
  }
  TextCountFunc.prototype.render = function(){
    var num = _getNum();
    if ($('#J_input_count').length == 0) {
      this.input.after('<span id="J_input_count"></span>');
    };
    $('#J_input_count').html(num+'个字');
  }
  //返回构造函数
  return TextCountFunc
})()
$(function(){
  new textCount2().init({id:"J_input"}).render()
})
//基本实现了功能，很多插件也都是这种方式，但是多人合作时，由于太过灵活，不好管理。
//所以还是要制定一套面向对象的规则
