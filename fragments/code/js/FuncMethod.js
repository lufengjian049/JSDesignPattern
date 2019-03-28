var property = function(key){
	return function(obj){
		return obj == null ? void 0 : obj[key];
	}
}


var isType = type => obj => obj !=null && Object.prototype.toString.call(obj) === `[object ${type}]`;
var isObject = isType("Object")
