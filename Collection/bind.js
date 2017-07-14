Function.prototype.bind = function(context){
	var _this = this,
		args = [].slice.call(arguments,1);

	return function(){
		var innerArgs = [].slice.call(arguments),
			finalArgs = args.concat(innerArgs);

		return _this.apply(context,finalArgs);
	}
}


//bind返回的绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的this值被忽略，同时调用时的参数被提供给模拟函数

//构造函数下的兼容

Function.prototype.bind = Function.prototype.bind || function(context){
	var _this = this;
	var args = [].slice.call(arguments,1);
	var F = function(){};
	F.prototype = this.prototype;
	var bound = function(){
		var innerArgs = [].slice.call(arguments),
			finalArgs = args.concat(innerArgs);
		return _this.apply(this instanceof F ? this : context || this , finalArgs);
	}
	bound.prototype = new F();
	return bound;
}

function test(arg1){
	this.arg1 = arg1;
}
var obj = {
	key:"value",
}
var bindfn = test.bind(obj,'test');

var instance1 = new bindfn();




