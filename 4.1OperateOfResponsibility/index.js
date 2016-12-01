//链模式
//链模式是基于原型继承的，并且在每一个原型方法的实现上都返回当前对象this，使其当前对象一直处于原型链作用域的顶端。
var A = function(){};
A.prototype = {
    length:2,
    size:function(){
        return this.length;
    }
}
//只能var a = new A();a.size();去访问。。。
//想A.size() 访问怎么办???
//借用另一个对象来实现
var A = function(){
    return B;
}
var B = A.prototype = {
    length:2,
    size:function(){
        return this.length;
    }
}
//可以这样访问
A().size();

//为了减少变量的创建，直接将B做成A的属性
var A = function(){
    return A.fn;
}
A.fn = A.prototype = {
    length:2,
    size:function(){
        return this.length;
    }
}
//获取元素对象
var A = function(selector){
    // return A.fn.init(selector);
    //多次调用后就会发现后面的会覆盖前面的对象,因为指向的都是同一个对象
    return new A.fn.init(selector);
}
A.fn = A.prototype = {
    //强化构造器，使 __proto__ 指向 A对象，默认指向A.fn.A.init,prototype属性所在的对象的指针
    constructor: A,
    init:function(selector){
        // return document.getElementById(selector);
        //为了可以继续使用size方法，我们需要返回当前对象A.fn,this指向A.fn,但是我们还要返回获取到的元素
        //将获取到的元素 作为this的一个属性，为了可以像数组一样访问，如下设置
        this[0] = document.getElementById(selector);

        console.log(this === A.fn,this === A.prototype , this);   // -------------------------搞明白 this 指向A.fn.A.init

        this.length = 1; //校正length属性
        return this;
    },
    length:2,
    size:function(){
        return this.length;
    }
}
//A("demo") __proto__ 为A.fn.A.init   __proto__指向构造函数的原型对象
//$("demo") __proto__ 为jQuery[0]
//解决方法如下,只要将构造函数的原型指向一个已存在的对象即可
A.fn.init.prototype = A.fn;

//A("demo").size();  //1

//选择器改造
var A = function(selector,context){
    return new A.fn.init(selector,context);
}
A.fn = A.prototype = {
    constructor : A,
    init:function(selector,context){
        this.length = 0;
        context = context || document;
        //如果是id选择符，按位非将-1转化为0，转化为false
        if(~selector.indexOf("#")){
            this[0] = document.getElementById(selector.slice(1));
            this.length = 1;
        }else{
            var doms = context.getElementsByTagName(selector),
                i = 0,
                len = doms.length;
            for(;i<len;i++){
                this[i] = doms[i];
            }
            this.length = len;
        }
        this.context = context;
        this.selector = selector;
        return this;
    },
    //查询出来对象，展现时更像是一个对象，而jQuery中则是数组。因为在一些浏览器中判断一个是对象是否是数组的时候，不仅仅判断有没有length属性，可否通过【索引】访问
    //还会判断其是否具有数组方法来确定是否用数组形式展现，所以...
    push:[].push,
    sort:[].sort,
    splice:[].splice
}

//拓展方法
A.extend = A.fn.extend = function(){
    //拓展对象中第二个参数算起
    var i = 1,
        len = arguments.length,
        target = arguments[0], // 源对象
        j;
    if(i == len){
        target = this;
        i--;
    }
    for(;i<len;i++){
        for(j in arguments[i]){
            target[j] = arguments[i][j]
        }
    }
    return target;
}
//测试用例
A.extend(A.fn,{version:"1.0"});
console.log(A("demo").version);

A.fn.extend({
    getVersion:function(){
        return this.version;
    }
})
A("demo").getVersion();
A.extend(A,{author:"ddd"});
A.author;

//有了extend，去实现链式调用
A.fn.extend({
    on:(function(){
        if(document.addEventListener){
            return function(type,fn){
                var i = this.length - 1;
                for(;i>=0;i--){
                    this[i].addEventListener(type,fn,false);
                }
                return this;
            }
        }else if(document.attachEvent){
            return function(type,fn){
                var i = this.length - 1;
                for(;i>=0;i--){
                    this[i].attachEvent(type,fn);
                }
                return this;
            }
        }else{
            return function(type,fn){
                var i = this.length - 1;
                for(;i>=0;i--){
                    this[i]["on"+type] = fn;
                }
                return this;
            }
        }
    })()
});

//border-color => borderColor
A.extend({
    cameCase:function(str){
        return str.replace(/\-(\w)/g,function(all,letter){
            return letter.toUpperCase();
        })
    }
})

A.extend({
    css:function(name){
        var arg = arguments,
            len = arg.length;
        if(this.length < 1){
            return this;
        }
        if(len == 1){
            //获取css
            if(typeof arg[0] === 'string'){
                //IE 
                if(this[0].currentStyle){
                    return this[0].currentStyle[arg[0]];
                }else{
                    return getComputedStyle(this[0],false)[arg[0]];
                }
                //为对象时设置多个样式
            }else if(typeof arg[0] === "object"){
                for(var i in arg[0]){
                    for(var j = this.length - 1;j>=0;j--){
                        this[j].style[A.cameCase(i)] = arg[0][i];
                    }
                }
            }
        }else if(len === 2){
            //两个参数
            for(var j = this.length-1;j>=0;j--){
                this[j].style[A.cameCase(arg[0])] = arg[1];
            }
        }
        return this;
    }
})
A.fn.extend({
    attr:function(){
        var arg = arguments,
            len = arg.length;
        if(this.length < 1){
            return this;
        }
        if(len === 1){
            if(typeof arg[0] === "string"){
                return this[0].getAttribute(arg[0]);
            }else if(typeof arg[0] === "object"){
                for(var i in arg[0]){
                    for(var j=this.length-1;j>=0;j--){
                        this[j].setAttribute(i,arg[0][i]);
                    }
                }
            }
        }else if(len === 2){
            for(var j = this.length - 1;j>= 0;j--){
                this[j].setAttribute(arg[0],arg[1]);
            }
        }
        return this;
    }
})
A.fn.extend({
    html:function(){
        var arg = arguments,
            len = arg.length;
        if(len === 0){
            return this[0] && this[0].innerHTML;
        }else{
            for(var i = this.length -1;i>=0;i--){
                this[i].innerHTML = arg[0];
            }
        }
        return this;
    }
})

//链式调用 返回this