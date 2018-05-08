//promise done finally stop ... delay deferred
//rsvp   
//asynquence

const State = {
  pending: 0,
  fulfilled: 1,
  rejected: 2
}
class TypeError extends Error {
  constructor(err) {
    super(err);
  }
}
class ESPromise {
  constructor(resolver) {
    if(typeof resolver !== 'function') {
      throw new Error('resolver must be a function!');
    }
    this.state = State.pending;
    this.data = void 0;
    this.queue = [];
    if(resolver !== util.noop) {
      util.safelyResolverThen(this,resolver);
    }
  }
  //promiseify
  static wrap(fn,ctx = null) {
    return () => {
      const args = [].slice.call(arguments);
      return new this((resolve,reject) => {
        fn.apply(ctx,args.push((err,value) => {
          if(err) {
            reject(err);
          }else{
            resolve(value);
          }
        }));
      })
    }
  }
  /**
   * 传进来的是一个promise的话，直接返回这个promise，否则，生成一个promise，并返回
   * @param {Promise|值类型} val 
   */
  static resolve(val) {
    if(val instanceof this) {
      return val;
    }
    return util.doResolve(new this(util.noop),val);
  }
  static reject(reason) {
    return util.doReject(new this(util.noop),reason);
  }
  /**
   * 有一个出错就走出错流程
   * @param {Array} iterable 
   */
  static all(iterable) {
    if(!Array.isArray(iterable)) {
      return this.reject(new TypeError('must be array'));
    }
    const len = iterable.length;
    if(len === 0) {
      return this.resolve([]);
    }
    const promise = new this(util.noop);
    let resolved = 0;
    const result = [];
    let called = false;
    //并发执行
    for(let i=0;i<len;i++) {
      this.resolve(iterable[i]).then(value => {
        result[i] = value;
        resolved++;
        if(resolved === len && !called) {
          called = true;
          util.doResolve(promise,result);
        }
      }).catch(error => {
        if(called) {
          return;
        }
        called = true;
        util.doReject(promise,error);
      })
    }
    return promise;
  }
  /**
   * 有一个成功or失败就往下走,then or catch
   * @param {Array} iterable 
   */
  static race(iterable) {
    if(!Array.isArray(iterable)) {
      return this.reject(new TypeError('must be array'));
    }
    const len = iterable.length;
    if(len === 0) {
      return this.resolve([]);
    }
    const promise = new this(util.noop);
    //called 有了最终状态，其余的回调就不用执行了
    let called = false;
    //也是并发执行
    for(let i=0;i<len;i++) {
      this.resolve(iterable[i]).then(value => {
        if(called) {
          return;
        }
        called = true;
        util.doResolve(promise,value);
      }).catch(error => {
        if(called) {
          return;
        }
        called = true;
        util.doReject(promise,error);
      })
    }
    return promise;
  }
  /**
   * deferre 可以自由控制promise
   */
  static deferred() {
    const deferred = {};
    deferred.promise = new this((resolve,reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    return deferred;
  }
  static stop() {
    return new this(util.noop);
  }
  /**
   * 判断promise是否在规定时间内完成，超时走catch流程，error 为TypeError类型
   * @param {Promise} promise 需要判断是否超时的promise对象
   * @param {Number} ms 超时ms
   */
  static timeout(promise,ms) {
    const timeoutPromise = this.resolve().delay(ms).then(() => {
      throw new TypeError('time out');
    });
    return Promise.race([promise,timeoutPromise]);
  }
  /**
   * 任务队列按序执行，tasks可以是thunkify后的function
   * @param {Array} tasks 需要顺序执行的任务队列,function task(callback) {...}
   */
  static sequence(tasks) {
    function recordValue(results,value) {
      results.push(value);
      return results;
    }
    const pushValue = recordValue.bind(null,[]);
    return tasks.reduce((promise,task) => {
      return promise.then(task).then(pushValue)
    },this.resolve());
    // return tasks.reduce((promise,task) => {
    //   return promise.then(value => {
    //     if(isPromise(task)) {
    //       return task.then
    //     }
    //   })
    // },this.resolve());
  }
  /**
   * 给超时任务在附加一个then监听，处理超时的清理工作
   * @param {*} promise 
   */
  // static observe(promise) {
  //   return promise.then(data => {

  //   }).catch(error => {

  //   })
  // }
  /**
   * 第一个完成的，注意全部失败的挂起
   * @param {*} iterable 
   */
  static first(iterable) {
    const len = iterable.length;
    return this.constructor((resolve,reject) => {
      let errorcount = 0;
      for(let i=0;i < len;i++) {
        this.resolve(iterable[i]).then(value => {
          resolve(value);
        }).catch(error => {
          errorcount++;
          if(errorcount === len) {
            reject('error');
          }
        })
      }
    })
  }
  // static map(iterable,cb) {
  //   return this.all(iterable.map(item => {
  //     this.resolve(item).then()
  //   }))
  // }
  /**
   * 传入处理成功回调和错误回调
   * 返回都是一个新的promise,
   * then方法异步处理回调
   * @param {Function} fulfilledFn 
   * @param {Function} rejectedFn 
   */
  then(fulfilledFn,rejectedFn) {
    //值穿透,将当前的promise对象往下传,前提是状态已经非pending了，这个情况只会在Promise构造器中同步resolve才会出现改情况
    //其他情况的值穿透，在queue的callback里面，没有对应的rejectCallback，直接将当前promise置为rejected，继续往下
    if((this.state === State.fulfilled && typeof fulfilledFn !== 'function') || (this.state === State.rejected && typeof rejectedFn !== 'function')) {
      return this;
    }
    //返回一个新的promise
    const promise = new this.constructor(util.noop);
    //当前promise还未结束
    if(this.state === State.pending) {
      this.queue.push({
        callFulfilled(value) {
          if(typeof fulfilledFn === 'function') {
            util.unwrap(promise,fulfilledFn,value);
          }else{
            util.doResolve(promise,value);
          }
        },
        callRejected(reason) {
          if(typeof rejectedFn === 'function') {
            util.unwrap(promise,rejectedFn,reason);
          }else{
            util.doReject(promise,reason);
          }
        }
      });
    }else{
      const resolver = this.state === State.fulfilled ? fulfilledFn : rejectedFn;
      util.unwrap(promise,resolver,this.data);
    }
    return promise;
  }
  catch(callback) {
    return this.then(null,callback);
  }
  done(fulfilledFn,rejectedFn) {
    this.then(fulfilledFn,rejectedFn).catch(error => {
      setTimeout(() => {
        throw error
      })
    })
  }
  delay(ms) {
    return this.then(value => {
      return new ESPromise((resolve,reject) => {
        setTimeout(() => {
          resolve(value);
        },ms)
      })
    }).catch(error => {
      return new ESPromise((resolve,reject) => {
        setTimeout(() => {
          reject(error);
        },ms);
      })
    })
  }
}
const util = {
  noop() {},
  /**
   * 处理两种function
   * 1.Promise构造函数，new Promise((resolve,reject) => {}),传进来一个处理函数，给到继续下去的方法(resove,reject)
   * 2.动态绑定到父promise-then返回的promise上的then方法，参数then =  () => {then.apply(promise,arguments)}; then的回调主要用于 resolve父promise的状态
   * @param {Promise} promise 
   * @param {Function} then 
   */
  safelyResolverThen(promise,then) {
    let called = false;
    try {
      //传给promise构造器的是resolve语义,处理当前promise状态
      //传给then的是一个callback handle,处理父promise状态，还把里面promise的value，传到父promise上
      then(function(value) {
        if(called) {
          return;
        }
        called = true;
        util.doResolve(promise,value);
      },function(reason) {
        if(called) {
          return;
        }
        called = true;
        util.doReject(promise,reason);
      });
    } catch (error) {
      if(called) {
        return;
      }
      called = true;
      util.doReject(promise,reason);
    }
  },
  /**
   * 统一处理promise和then的返回值
   * @param {*} promise 
   * @param {*} value 
   */
  doResolve(promise,value) {
    if(promise.state !== State.pending) {
      return;
    }
    try {
      const thenfn = util.getThen(value);
      if(thenfn) {
        //将内promise解开，处理父promise
        util.safelyResolverThen(promise,thenfn);
      }else{
        promise.state = State.fulfilled;
        promise.data = value;
        promise.queue.forEach(queueitem => {
          queueitem.callFulfilled(value)
        });
      }
    } catch (error) {
      util.doReject(promise,error);
    }
    return promise;
  },
  doReject(promise,reason) {
    if(promise.state !== State.pending) {
      return;
    }
    promise.state = State.rejected;
    promise.data = reason;
    promise.queue.forEach(queueitem => {
      queueitem.callRejected(reason);
    })
    return promise;
  },
  /**
   * 实际执行then回调的方法，异步处理，在microtask,改变promise状态
   * @param {*} promise 
   * @param {*} resolver 
   * @param {*} value 
   */
  unwrap(promise,resolver,value) {
    process.nextTick(function() {
      let result;
      try {
        result = resolver(value);
      } catch (error) {
        util.doReject(promise,error);
      }
      if(result === promise) {
        util.doReject(promise,'cannot resolve promise with isself');
      }else{
        util.doResolve(promise,result);
      }
    })
  },
  /**
   * 主要处理then返回的是promise，针对该promise，动态绑定then方法改变父promise的状态
   * @param {Promise} promise 
   */
  getThen(promise) {
    const then = promise && promise.then;
    if(promise && typeof then === 'function') {
      return function() {
        then.apply(promise,arguments);
      }
    }
  }
}

//test
new ESPromise((resolve,reject) => {
  setTimeout(() => {
    reject(100);
  },1000);
}).then(value => {
  console.log(value);
  return new ESPromise(resolve => {
    setTimeout(() => {
      resolve(value * 10);
    },2000);
  })
}).then(value => console.log(value)).catch(error => {
  console.log('error:',error);
  return 'catch continue..'
}).then(value => console.log(value));

ESPromise.all([
  ESPromise.resolve(111).delay(1000),
  ESPromise.resolve(222).delay(500),
]).then(value => console.log(value));

ESPromise.timeout(ESPromise.resolve(111).delay(200),500).then(value => console.log('no out',value)).catch(error => console.log('timeout',error));