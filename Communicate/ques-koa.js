//simple http
// var http = require('http')
// http.createServer(function(req,res){
//   res.writeHead(200,{'Content-Type': 'text/plain'})
//   res.end('hello koa\n')
// }).listen(1337,'127.0.0.1')
// console.log('Server running at http://127.0.0.1:1337/');

//simple koa
var http = require('http')
function Application(){
  this.context = {}
  this.context['res'] = null
}
var app = Application.prototype
function respond(){
  this.res.writeHead(200,{'Content-Type': 'text/plain'})
  this.res.end(this.body)
}
app.use = function(fn){
  this.do = fn
}
app.callback = function(){
  var fn = this.do
  var that = this
  return function(req,res){
    that.context.res = res
    fn.call(that.context)
    respond.call(that.context)
  }
}
app.listen = function(){
  var server = http.createServer(this.callback())
  return server.listen.apply(server,arguments)
}
var appObj = new Application();
appObj.use(function(){
    this.body = "hello world!";
})
appObj.listen(3000);

//顺序流机制：尾触发机制， 前置代码区、后置代码区、切面
//compose出一个启动函数
function App(){
  this.context = {};
  this.middlewares = [];
}
var appproto = App.prototype;
appproto.use = function(fn){
  this.middlewares.push(fn)
}
var compose = function(){
  var mds = [].slice.call(arguments,0)
  var curfn;
  var _next = function(){
    if((curfn = mds.shift()) != void 0){
      curfn.call(this,_next);
    }
  }.bind(this)
  return function(){
    _next();
  }
}
var endmthod = function(next){
  next();
  console.log(this)
  console.log('the end...');
}
appproto.start = function(){
  console.log('start...');
  //compose返回一个启动fn
  var mds = [endmthod].concat(this.middlewares);
  var fn = compose.apply(this.context,mds);
  fn.call(this.context)
}
var app1 = new App()
app1.use(function(next){
  console.log('md1...start');
  this.test = 'md1';
  next();
  console.log('md1...end');
});
app1.use(function(next){
  console.log('md2...start');
  this.test2 = 'md2';
  next()
  console.log('md2...end');
})
app1.start()


// function compose(handlelist,ctx) {
//   return co(function * () {
//     var prev = null;
//     var i = handlelist.length;
//     while (i--) {
//       prev = handlelist[i].call(ctx, prev);
//     }
//     yield prev;
//   })
// }