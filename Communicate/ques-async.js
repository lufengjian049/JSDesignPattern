function co_old(generatorFunction){
  var it = generatorFunction()
  return function(cb){
    var iterator = null
    var _next = function(...args){
      iterator = it.next(...args)
      if(iterator.done){
        cb && cb(...args)
      }else{
        iterator.value(_next)
      }
    }
    _next()
  }
}
//yield thunk(callback)

//尾触发机制，connect中间件
var App = {
  handles:[],
  use:function(handle){
    if(typeof handle == 'function'){
      App.handles.push(handle)
    }
  },
  next:function(data){
    var handlelist = App.handles
    var _next = App.next
    var handle
    if((handle = handlelist.shift())){
      handle.call(App,data,_next)
    }
  },
  start:function(data){
    App.next(data)
  }
}
//App.use(xxxx);App.start()
//function(data,next){}
function isPromise(obj){
  return obj && typeof obj.then === 'function'
}
function isObject(obj){
  return Object == obj.constructor
}
function isGenerator(obj){
  return obj && typeof obj.next == 'function' && typeof obj.throw == 'function'
}
function isGeneratorFunction(obj){
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}
function toPromise(obj){
  if(!obj)
    return obj
  if(isPromise(obj)) return obj
  if(isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this,obj)
  if(typeof obj == 'function')
    return thunkToPromise.call(this,obj)
  if(Object.prototype.toString.call(obj) == '[object Array]' || Array.isArray(obj))
    return arrayToPromise.call(this,obj)
  if(isObject(obj))
    return objectToPromise.call(this,obj)
  return obj
}
function thunkToPromise(fn){
  var ctx = this
  return new Promise(function(resolve,reject){
    fn.call(ctx,function(err,ret){
      if(err){
        return reject(err)
      }
      //如果有多个参数
      if(arguments.length > 2)
        ret = [].slice.call(arguments,1)
      resolve(ret)
    })
  })
}
function arrayToPromise(arr){
  return Promise.all(arr.map(toPromise,this))
}
function objectToPromise(obj){
  //小技巧，生成一个跟obj一样类型的克隆空对象
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    //递归调用
    var promise = toPromise.call(this, obj[key]);
    //如果转换后是promise对象，就异步的去赋值
    if (promise && isPromise(promise)) defer(promise, key);
    //如果不能转换，说明是纯粹的值。就直接赋值
    else results[key] = obj[key];
  }
  //监听所有队列里面的promise对象，等所有的promise对象成功了，代表都赋值完成了。就可以调用then，返回结果results了。
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    //先占位
    results[key] = undefined;
    //把当前promise加入待监听promise数组队列
    promises.push(promise.then(function (res) {
      //等当前promise变成成功态的时候赋值
      results[key] = res;
    }));
  }
}
//co由thunk改promise
function co(gen){
  var ctx = this
  //将gen function => gen 对象
  if(typeof gen == 'function')
    gen = gen.call(ctx)
  return new Promise(function(resolve,reject){
    if(!gen || typeof gen.next != 'function')
      return resolve(gen)
    //启动迭代
    onFullFilled()

    function onFullFilled(res){
      var ret;
      try {
        //获取 yield的返回值
        ret = gen.next(res)
      } catch (error) {
        return reject(error)
      }
      //启动调用链
      next(ret)
    }
    function onFullRejected(err){
      var ret;
      try {
        ret = gen.throw(err)
      } catch (error) {
        return reject(error)
      }
      next(ret)
    }
    function next(ret){
      if(ret.done)
        return resolve(ret.value)
      //function object array changeto promise
      var value = toPromise.call(ctx,ret.value)
      if(value && isPromise(value)){
        value.then(onFullFilled,onFullRejected)
      }
      return onFullRejected('error')
    }
  })
}
co(function *(){
  var a = yield Promise.reject("for a value--error")
  console.log('a=',a)
  var b = yield Promise.resolve("for b value")
  console.log('b=',b)
  return b
}).then(function(val){
  console.log('then..',val)
},function(err){
  console.log('then error..',err)
})
