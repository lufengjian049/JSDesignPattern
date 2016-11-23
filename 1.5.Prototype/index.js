//原型模式
//通过原型实现继承
//注意 原型对象 是一个共享对象 ，那么对原型对象的拓展（对原型对象的原型添加方法），不论是子类还是父类的实例对象 都会继承下来
//不过原型模式更多的用在对象创建上
//思想：如果创建一个实例对象的构造函数比较复杂或者耗时比较长，或者通过创建多个对象来实现。此时最好不要用new去复制这些基类，
//但可以对这些对象属性或者方法进行复制来实现创建

function prototypeExtend(){
    var F = function(){}, //缓存类
        arg = arguments,
        i=0,
        len = arg.length;
    
    for(;i<len;i++){
        for(var j in arg[i]){
            F.prototype[j] = arg[i][j];
        }
    }
    //返回缓存类的一个实例
    return new F();
}

var cat = prototypeExtend({
    speed:10,
    run:function(){
        console.log("奔跑的速度"+this.speed)
    }
},{
    jump:function(){
        console.log("jump")
    }
})

cat.run();
cat.jump();

//通过prototypeExtend创建的一个对象，我们就无需再用new去创建了，可以直接使用