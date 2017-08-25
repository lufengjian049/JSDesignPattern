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
//----thunkify
function thunkify(fn){
  return function(){
    var args = [].slice.call(arguments)
    return function(cb){
      args.push(cb)
      fn.apply(null,args)
    }
  }
}
//test thunkify
function foo(a,b,cb){
  setTimeout(function(){
    cb(a+b)
  },100)
}
var fooThunkory = thunkify(foo)
var fooThunk1 = fooThunkify(1,2)
var fooThunk2 = fooThunkify(1,1)
fooThunk1(function(sum){
  // console.log(sum)
})
fooThunk2(function(sum){
  // console.log(sum)
})
//---thunkify

//co-thunk -> error-first style
function co_thunk(genFunc){
  return function(done){
    var ctx = this
    var iterator = isGenerator(genFunc) ? genFunc : genFunc.call(ctx)
    var _next = function(err,args){
      // console.log("next")
      var ret = iterator.next(args)
      if(ret.done)
        done.call(ctx,err,ret.value)
      else{
        //支持更多yield 类型,toThunk ,array object
        var value = toThunk(ret.value,ctx)
        value(_next)
      }
    }
    _next()
  }
}
//将对象 或者数组 转为thunk ,支持 object，array，promise,generator,generatorFunction
function toThunk(obj,ctx){
  if(isGenerator(obj)){
    return co_thunk(obj)
  }
  if(isGeneratorFunction(obj)){
    return co_thunk(obj.call(ctx))
  }
  if(isObject(obj) || isArray(obj)){
    return objectToThunk.call(ctx,obj)
  }
  if(isPromise(obj)){
    return promiseToThunk.call(ctx,obj)
  }
  return obj
}
//也是返回一个thunk函数。。。思路，都是讲数组中的thunk拿出来执行一遍，通过一个公用的length长度，执行完则长度-1，直到length为0 代表全部执行完成
function objectToThunk(obj){
  var ctx = this
  return function(done){
    var keys = Object.keys(obj)
    var results = new obj.constructor()
    var length = keys.length
    var _run = function(fn,key){
      //实现深度遍历，防止有数组嵌套等...
      fn = toThunk(fn)
      fn.call(ctx,function(err,res){
        results[key] = res
        --length || done.call(null,null,results)
      })
    }
    keys.forEach(function(key){
      _run(obj[key],key)
    })
  }
}
//yield promise
function promiseToThunk(promise){
  var ctx = this
  return function(done){
    promise.then(function(res){
      done.call(ctx,null,res)
    },function(err){
      done.call(ctx,err,null)
    })
  }
}
var fs = require('fs');
function size(file) {
  return function(next){
    setTimeout(function(){
      next(null,~(Math.random() * 100))
    },1000)
    // fs.stat(file, function(err, stat){
    //   if (err) return next(err);
    //   next(null, stat.size || 0);
    // });
  }
}
//co也是返回一个thunk
//thunk的函数格式都应该是(err,args)
console.log('yield thunk..')
co_thunk(function *(){
  var a = yield size('./second.md');
  var b = yield size('./test.html');
  console.log(a);
  console.log(b);
  return [a,b];
})(function (err,args){
  console.log("callback===args=======");
  console.log(args);
})
console.log('yield thunk array....')
//并行执行
co_thunk(function *(){
  var a = size('./second.md')
  var b = size('./test.html')
  var s = yield [a,b]
  return s
})(function(err,args){
  console.log("yield array callback args")
  console.log(args)
  console.log('err',err)
})
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
  return  obj && Object == obj.constructor
}
function isArray(obj){
  return Object.prototype.toString.call(obj) == '[object Array]' || Array.isArray(obj)
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
  if(isArray(obj))
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
// co(function *(){
//   var a = yield Promise.reject("for a value--error")
//   console.log('a=',a)
//   var b = yield Promise.resolve("for b value")
//   console.log('b=',b)
//   return b
// }).then(function(val){
//   console.log('then..',val)
// },function(err){
//   console.log('then error..',err)
// })

function run(gen){
  var args = [].slice.call(arguments,1)
  it = isGenerator(gen) ? gen : gen.apply(this,args)
  return Promise.resolve().then(function handleNext(value){
    var next = it.next(value)
    return (function handleResult(next){
      if(next.done){
        return next.value
      }else{
        return Promise.resolve(next.value)
                  .then(handleNext,
                    function handleError(err){
                      return Promise.resolve(
                              it.throw(err)
                              ).then(handleResult);
                    }
                  )
      }
    })(next);
  })
}
