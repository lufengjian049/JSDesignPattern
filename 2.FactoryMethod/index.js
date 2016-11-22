//工厂方法模式

//安全模式创建的工厂类 --- 应对 忘记通过 new 创建对象的情况(this 指向window)
var Factory = function(type,content){
    if(this instanceof Factory){
        var s = new this[type](content);   // ?? new ?? 
        return s;
    }else{
        return new Factory(type,content);
    }
}

Factory.prototype = {
    Java:function(content){

    },
    javascript:function(content){
        this.content = content;
        console.log(content);
    },
    php:function(content){

    }
}

var js = Factory("javascript","test test content");
console.log("实例对象---"+js.content);

// console
// test test content
// 实例对象---test test content

//创建不同种类的对象 
//可以创建多个类的实例对象，