//访问者模式
//思想：在不改变操作对象的同时，为其添加新的操作方法，来实现对操作对象的访问

//在IE中用DOM2级事件绑定事件时，this不是指向当前dom对象，而是window对象

function bindIEEvent(dom,type,fn,data){
    var data = data || {};
    dom.attachEvent("on"+type,function(e){
        fn.call(dom,e,data);
        //通过call改变函数的作用域，这正是 访问者模式的精髓
        //还为事件 传递一个 data 参数，一般事件的回调函数 只有一个 event 参数
    })
}

//对象访问器

var Visitor = (function(){
    return {
        splice:function(){
            var args = Array.prototype.splice.call(arguments,1);
            return Array.prototype.splice.apply(arguments[0],args);
        },
        push:function(){
            //强化数组对象，使其拥有langth属性
            var len = arguments[0].length || 0;
            var args = this.splice(arguments,1);
            //校正length属性
            arguments[0].length = len + arguments.length - 1;

            return Array.prototype.push.apply(arguments[0],args);
        },
        pop:function(){
            return Array.prototype.pop.apply(arguments[0]);
        }
    }
})();

var a = new Object();
console.log(a.length);
Visitor.push(a,1,2,3,4);
console.log(a.length);
console.log(a);