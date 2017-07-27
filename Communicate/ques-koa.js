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