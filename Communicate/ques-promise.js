function promise_old(fn){
  var callbacks = [];
  this.then = function(onFullFilled){
    callbacks.push(onFullFilled);
    //支持链式调用
    return this;
  };
  var resolve = function(value){
    //防止 then方法还未注册回调，resolve方法已经执行。。。将resolve方法加到任务队列末尾
    setTimeout(function(){
      callbacks.forEach(function(callback){
        callback(value);
      });
    },0);
  };
  fn(resolve);
}
//如果Promise异步操作已经成功，这时，在异步操作成功之前注册的回调都会执行，但是在Promise异步操作成功这之后调用的then注册的回调就再也不会执行了

function Promise(fn) {
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
      if(!callback.onFulfilled) {
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
          callbacks.forEach(function (callback) {
              handle(callback);
          });
      }, 0);
  }

  fn(resolve);
}
function getUserInfo(){
  return new Promise(function(resolve){
    console.log("getUserInfo fn");
    setTimeout(function(){
      console.log("getUserInfo time");
      resolve({
        id:1
      });
    },1000);
  });
}
function getUserJobInfo(id){
  return new Promise(function(resolve){
    console.log("getUserJobInfo fn");
    setTimeout(function(){
      console.log("getUserJobInfo time");
      resolve({
        info:"id:"+id.id+";job:test"
      });
    },1000);
  });
}
getUserInfo().then(getUserJobInfo)
  .then(function(info){
    console.log(info.info);
  });