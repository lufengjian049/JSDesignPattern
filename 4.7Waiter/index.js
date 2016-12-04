//等待者模式
//通过对多个异步进程监听，来触发未来发生的动作

var Waiter = function(){
    //等待对象容器
    var dfd = [],
        doneArr = [], //成功回调方法容器
        failArr = [], //失败方法回调容器
        slice = [].slice,
        that = this;

    //监控对象类
    var Promise = function(){
        this.resolved = false;
        this.rejected = false;
    }
    Promise.prototype = {
        resolve:function(){
            //当前监控对象解决成功
            this.resolved = true;
            if(!dfd.length)
                return;
            for(var i=dfd.length-1;i>=0;i--){
                //如果有任一个监控对象没有被解决 或者 已经失败 则返回 不进行下面操作
                if(dfd[i] && !dfd[i].resolved || dfd[i].rejected)
                    return;
                dfd.splice(i,1);
            }
            //执行解决成功回调
            console.log("donearr",doneArr)
            _exec(doneArr);
        },
        reject:function(){
            this.rejected = true;
            if(!dfd.length)
                return;
            //清除所有监控对象
            dfd.splice(0);
            _exec(failArr);
        }
    };

    that.Deferred = function(){
        return new Promise();
    }
    function _exec(arr){
        var i = 0,
            len = arr.length;
        for(;i<len;i++){
            try {
                arr[i] && arr[i]();
            } catch (error) {
                
            }
        }
    }
    //组合监控对象
    that.when = function(){
        //获取监控的对象
        dfd = slice.call(arguments);
        var i = dfd.length;
        for(--i;i>=0;i--){
            //如果不存在监控对象 或者 监控对象已经解决 或者不是监控对象
            if(!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Promise){
                //清理内存，清除当前监控对象
                dfd.splice(i,1);
            }
        }
        console.log(dfd);
        return that;
    }

    that.done = function(){
        doneArr = doneArr.concat(slice.call(arguments));
        return that;
    }

    that.fail = function(){
        failArr = failArr.concat(slice.call(arguments));
        return that;
    }
}

var waiter = new Waiter();
//第一个彩蛋
var first = function(){
    //创建监听对象
    var dfd = waiter.Deferred();
    setTimeout(function(){
        console.log("first finish");
        dfd.resolve();
    },5000);
    //必须返回监听对象
    return dfd;
}();

var second = function(){
    var dfd = waiter.Deferred();
    setTimeout(function() {
        console.log("second finish");
        dfd.resolve();
    }, 10000);
    return dfd;
}();

waiter.when(first,second)
        .done(function(){
            console.log("success");
        },function(){
            console.log("success again");
        })
        .fail(function(){
            console.log("fail");
        })

//长轮询
(function getAjaxData(){
    var fn = arguments.callee;
    setTimeout(function(){
        $.get("ddd.php",function(){
            console.log("轮询一次");
            fn();
        })
    },5000);
})();