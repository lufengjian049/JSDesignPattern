function promise_old(fn) {
  var callbacks = [];
  this.then = function (onFullFilled) {
    callbacks.push(onFullFilled);
    //支持链式调用
    return this;
  };
  var resolve = function (value) {
    //防止 then方法还未注册回调，resolve方法已经执行。。。将resolve方法加到任务队列末尾
    setTimeout(function () {
      callbacks
        .forEach(function (callback) {
          callback(value);
        });
    }, 0);
  };
  fn(resolve);
}
// 如果Promise异步操作已经成功，这时，在异步操作成功之前注册的回调都会执行，但是在Promise异步操作成功这之后调用的then注册的回调就再也不会执行
// 了

function Promise2(fn) {
  var state = 'pending',
    value = null,
    callbacks = [];

  this.then = function (onFulfilled) {
    console.log("then...");
    return new Promise(function (resolve) {
      handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve
      });
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }
    //如果then中没有传递任何东西
    if (!callback.onFulfilled) {
      callback.resolve(value);
      return;
    }

    var ret = callback.onFulfilled(value);
    callback.resolve(ret);
  }

  function resolve(newValue) {
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (typeof then === 'function') {
        then.call(newValue, resolve);
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    setTimeout(function () {
      callbacks
        .forEach(function (callback) {
          handle(callback);
        });
    }, 0);
  }

  fn(resolve);
}
function getUserInfo() {
  return new Promise(function (resolve) {
    console.log("getUserInfo fn");
    setTimeout(function () {
      console.log("getUserInfo time");
      resolve({id: 1});
    }, 1000);
  });
}
function getUserJobInfo(id) {
  return new Promise(function (resolve) {
    console.log("getUserJobInfo fn");
    setTimeout(function () {
      console.log("getUserJobInfo time");
      resolve({
        info: "id:" + id.id + ";job:test"
      });
    }, 1000);
  });
}
// getUserInfo()
//   .then(function (id) {
//     return {
//       info: "id:" + id.id
//     };
//   })
//   .then(function (info) {
//     console.log(info.info);
//   });
//-- Promise --  https://github.com/xieranmaya/blog/issues/3
//then 是异步回调
//immediate -- https://github.com/calvinmetcalf/immediate/blob/master/lib/index.js
//https://zhuanlan.zhihu.com/p/34421918
//https://github.com/whinc/blog/issues/2
//bluebird https://www.ibm.com/developerworks/cn/web/wa-lo-use-bluebird-implements-power-promise/index.html
//0.为什么then方法是异步调用? 同步和异步可能会引发混乱
//1.为什么.then方法返回的是一个新的promise对象而不是this，而进行链式调用?
//2.为什么.then的执行函数只会执行一次？
      // promise对象的状态从pending转换为Fulfilled或者Rejected后，这个状态就不可变了(settled);所以then的回调只执行一次
//3.Promise.resolve()方法的功效? 1.new Promise的快捷方式 2.将thenable对象转化为Promise对象
//4.什么是thenable对象？ 具有.then方法的一类对象，但是具有与Promise所拥有的then方法相同的功能和处理过程
//then函数必须有返回值；
//then函数返回的是一个非promise对象，需要resolve完成then返回的promise对象
//                  promise对象，给promise对象附加then方法，在附加的then方法内，resolve完成父promise(then返回的promise)的状态。
//                  附加的then方法，其实只做一件事件，就是resolve操作。跟new Promise(exector)的exector一样
//https://github.com/getify/asynquence
function PromiseNew(executor) {
  var self = this;
  this.status = 'pending';
  this.data = undefined;
  this.onResolvedCallbacks = [];
  this.onRejectedCallbacks = [];
  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'resolved';
      self.data = value;
      for (let i = 0; i < self.onResolvedCallbacks.length; i++) {
        self.onResolvedCallbacks[i](value);
      }
    }
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected';
      self.data = reason;
      for (let i = 0; i < self.onRejectedCallbacks.length; i++) {
        self.onRejectedCallbacks[i](reason);
      }
    }
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
PromiseNew.prototype.then = function (onResolve, onReject) {
  var promise2;
  var self = this;
  onResolve = typeof onResolve === 'function'
    ? onResolve
    : value => value;
  onReject = typeof onReject === 'function'
    ? onReject
    : value => value;
  if (this.status === 'resolved') {
    return promise2 = new PromiseNew(function (resolve, reject) {
      try {
        var result = onResolve(self.data);
        if (result instanceof PromiseNew) {
          result.then(resolve, reject);
          // promise2 = result; return;
        }
        resolve(result);
      } catch (error) {
        reject(error)
      }
    })
  }
  if (this.status === 'rejected') {
    return promise2 = new PromiseNew(function (resolve, reject) {
      var result = onReject(self.data);
      if (result instanceof PromiseNew) {
        promise2 = result;
        return;
      }
      reject(result);
    })
  }
  if (this.status === 'pending') {
    return new PromiseNew(function (resolve, reject) {
      self
        .onResolvedCallbacks
        .push(function (value) {
          var result = onResolve(value);
          if (result instanceof PromiseNew) {}
        })
    })
  }
}

new Promise((resolve,reject) => {
  resolve(2);
}).then(value => {
  console.log('then....1');
  return new Promise((resolve,reject) => {
    console.log(value);
    setTimeout(() => {
      resolve(value * 10);
    },10);
  })
}).then(value => {
  console.log(value);
});
console.log('end..');

class TimeoutError extends Error {
  constructor(error) {
    super(error);
  }
}
function delayPromise(ms) {
  return new Promise((resolve,reject) => {
    setTimeout(resolve,ms);
  })
}
function timeoutPromise(promise,ms) {
  var timeout = delayPromise(ms).then(() => {
    throw new TimeoutError('Operaction timed out after ' + ms + 'ms');
    // return Promise.reject(0);
  });
  return Promise.race([promise,timeout]);
}
var taskPromise = new Promise(resolve => {
  var delay = Math.random() * 2000;
  setTimeout(() => {
    resolve(delay + 'ms');
  },delay);
})
// timeoutPromise(taskPromise,1000).then(value => {
//   console.log('end:' + value);
// }).catch(error => {
//   if(error instanceof TimeoutError) {
//     //取消 接口请求的abort
//   }
//   console.log('error:' + (error instanceof TimeoutError));
// })

//给一个函数附加了太多的功能，根据分离职责的原则，可以将功能分离出去
function createXHRPromise1(url) {
  var req = new XMLHttpRequest();
  //...
  var promise = new Promise((resolve,reject) => {});
  var abort = function() {
    if(req.readyState !== XMLHttpRequest.UNSENT) {
      req.abort();
    }
  }
  return {
    promise,
    abort,
  }
}

//改进,函数职责单一
var requestMap = {};
function createXHRPromise(url) {
  var req = new XMLHttpRequest();
  //...
  var promise = new Promise((resolve,reject) => {});
  requestMap[url] = {
    req,
    promise
  }
  return promise;
}
function cancelPromise(promise) {
  var request;
  Object.keys(requestMap).some((url) => {
    if(requestMap[url].promise === promise) {
      request = requestMap[url].req;
      return true;
    }
  })
  if(request && request.readyState === XMLHttpRequest.UNSENT) {
    request.abort();
  }
}

async function asyncfn() {
  const p1 = new Promise(resolve => setTimeout(() => {resolve(111);console.log('p1')},2000));
  const p2 = new Promise(resolve => setTimeout(() => {resolve(222);console.log('p2')},1000));
  const response1 = await p1;
  console.log('response 1',response1);
  const response2 = await p2;
  console.log('response 2',response2);
  // return response;
  return {
    response1,
    response2
  }
}
asyncfn().then(value => console.log('from async',value));

//callback -> promise -> generator(co) -> async/await

//promise 队列
function sequenceTasks(tasks) {
  function recordValue(results,value) {
    results.push(value);
    return results;
  }
  const pushValue = recordValue.bind(null,[]);
  return tasks.reduce((promise,task) => {
    return promise.then(task).then(pushValue)
  },Promise.resolve());
}
