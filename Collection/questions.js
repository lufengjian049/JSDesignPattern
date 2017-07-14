//instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上
null instanceof Object == false
//true
//--
var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing');
//+ 的优先级 > ? 所以等价于
'Value is true' ? 'Something' : 'Nothing';
// 'Something'
//--

//--
var name = 'World!';
(function () {
    if (typeof name === 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
//functions 和 变量 会提升，变量会提升到当前作用域的顶部
var name = 'World!';
(function(){
	var name;
	if(typeof name == 'undefined'){
		name = 'Jack';
		console.log("Goodbye " + name);
	}else {
        console.log('Hello ' + name);
    }
})()

//'Goodbye Jack'

//-
var END = Math.pow(2, 53);
var START = END - 100;
var count = 0;
for (var i = START; i <= END; i++) {
    count++;
}
console.log(count);
//Math.pow(2,53)是最大的值，+ 1 还是等于最大值 没有变量，所以是死循环
//-

