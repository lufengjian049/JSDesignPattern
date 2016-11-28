// 策略模式
//将定义的一组算法封装起来，使其相互之间可以替换。封装的算法具有一定的独立性，不会随客户端变化而变化

//也是定义了一种 分支条件的处理方式，只不过该模式更注重算法的实现

var InputStrategy = function(){
    var strategy = {
        //是否为空
        notNull:function(value){
            return /\s+/.test(value) ? '请输入内容' : ''
        },
        number:function(value){
            return /^[0-9]+(\.[0-9]+)?$/.test(value) ? '' : '请输入数字';
        }
        //等等 算法
    }
    return {
        check:function(type,value){
            value = value.replace(/^\s+|\s+$/g,'');
            return strategy[type] ? strategy[type](value) : '没有该类型的检测方法'
        },
        //添加策略 接口
        addStrategy:function(type,fn){
            strategy[type] = fn;
        }
    }
}();

//策略模式最主要的特色是创建一系列策略算法，解决了算法与使用者之间的耦合。