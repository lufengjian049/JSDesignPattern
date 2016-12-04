//惰性模式
//减少代码每次执行时重复的分支判断，通过对象重定义来屏蔽原对象中的分支判断
//多出现在 不同浏览器对事件委托机制的不同 等等...
//精髓在于：第一次执行后就重新定义它

//实现方式：
/*
1.在资源在加载进来时通过闭包执行该方法，对其重定义。会使加载时占用一定的资源
2.做一个延迟，在第一次调用时做重新定义
*/

//  1
A.on = function(dom,type,fn){
    if(document.addEventListener){
        return function(dom,type,fn){
            dom.addEventListener(type,fn,false);
        }
    }else if(document.attachEvent){
        return function(dom,type,fn){
            dom.attachEvent('on'+type,fn);
        }
    }else{
        return function(dom,type,fn){
            dom['on'+type] = fn;
        }
    }
}();

// 2,在用到这个时，才去重定义，所以最后要执行一遍
A.on = function(dom,type,fn){
    if(dom.addEventListener){
        A.on = function(dom,type,fn){
            dom.addEventListener(type,fn,false);
        }
    }else if(document.attachEvent){
        A.on = function(dom,type,fn){
            dom.attachEvent('on'+type,fn);
        }
    }else{
        A.on = function(dom,type,fn){
            dom['on'+type] = fn;
        }
    }
    //执行重定义的方法
    A.on(dom,type,fn);
}