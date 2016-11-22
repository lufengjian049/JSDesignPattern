//抽象工厂模式

//抽象类，通过在基类中定义方法 而不去实现，用throw抛出错误，强制继承类去实现基类的方法！！！

//抽象工厂方法
var AbstractFactory = function(subType,superType){
    if(typeof AbstractFactory[superType] === 'function'){
        function F(){};
        F.prototype = new AbstractFactory[superType]();
        subType.constructor = subType;
        subType.prototype = new F();
    }else{
        throw new Error("未创建该抽象类!!!");
    }
}
//小汽车抽象类
AbstractFactory.Car = function(){
    this.type = "Car";
}
AbstractFactory.Car.prototype = {
    getPrice:function(){
        throw new Error("抽象方法不能调用，请实现")
    }
}

//其它抽象类
//.....

//实现
var BMW = function(price,speed){
    this.price = price;
}
AbstractFactory(BMW,"Car");
BMW.prototype.getPrice=function(){
    return this.price;
}

var bmwcar = new BMW(200,100);
console.log(bmwcar.type);
console.log(bmwcar.getPrice());


//创建出来的不是一个真实的对象实例，而是一个类簇，制定了类的结构。
