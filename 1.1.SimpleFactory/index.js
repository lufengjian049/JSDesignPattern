//通过类实例化对象创建 形成 一个工厂
var Alert = function(){};
var Confirm = function(){};
var Prompt = function(){};
//简单的工厂
var PopFactory = function(name){
    switch(name){
        case 'alert' :
            return new Alert();
        case 'confirm':
            return new Confirm();
        case 'prompt':
            return new Prompt();
    }
}

//简单工厂的理念就是创建对象，但是可能工厂产生的对象会有很多相似的地方，我们可以把这些相似的地方抽取出来，将不同的地方，通过传参的形式进行处理

//第二种 方案,通过创建一个新对象然后包装增强其属性和方法来实现。

var createPop = function(type,text){
    var obj = new Object();
    obj.content = text;
    obj.show = function(){

    };
    if(type == "alert"){
        //差异部分
    }
    if(type == "confirm"){
        //差异部分
    }
    if(type == "prompt"){
        //差异部分
    }

    return obj;
}

//创建单个对象


