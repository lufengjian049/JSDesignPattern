var noop = function() {};

function Promise() {
	this.callbacks = [];
}

Promise.prototype = {
	constructor: Promise,

	resolve: function(result) {
		this.complete('resolve',result)
	},

	reject: function(result) {
		this.complete('reject',result)
	},

	complete: function(type, result) {
		while (this.callbacks[0]) {
			this.callbacks.shift()[type].call(this, result);
		}
	},

	then: function(successHandler, failureHandler) {
		this.callbacks.push({
			resolve: successHandler || noop,
			reject: failureHandler || noop
		});
	}
};

// 测试
var p = new Promise();

setTimeout(function() {
	console.log('setTimeout');
	p.resolve('test');
}, 2000);

p.then(function(result) {
	console.log(result);
});

function delegate(parentEl, child, eventName, handler) {
  //目标元素集合
	var childCollection = parentEl.querySelectorAll(child);
  //将目标元素集合转化为数组
	var childs = Array.prototype.slice.call(childCollection);

	parentEl.addEventListener(eventName, function(e) {
		var eventTarget = e.target;
		
		if (~childs.indexOf(eventTarget)) {
			handler(e);
		}
	}, false);
}

var val = 'smtg';
console.log('Value is ' + (val === 'smtg') ? 'Something' : 'Nothing'); //Something