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