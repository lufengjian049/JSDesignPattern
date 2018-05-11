//channel 对事件源的抽象
function channel() {
  let taker;
  function take(cb) {
    taker = cb;
  }
  function put(input) {
    if(taker) {
      let tmptaker = taker;
      taker = null;
      tmptaker(input);
    }
  }
  return {
    put,
    take
  }
}
const chan = channel()
//effect
function take() {
  return {
    type: 'take'
  }
}
function runTakeEffect(effect,next) {
  chan.take(input => {
    next(input);
  })
}
//effect
//fork出一个新的task
// function *takeEvery(worker) {
//   yield fork(function *() {
//     while(true) {
//       const action = yield take();
//       worker(action);
//     }
//   })
// }
function takeEvery(worker) {
  return fork(function *() {
    while(true) {
      const action = yield take();
      worker(action);
    }
  })
}
//启动一个新的task
function fork(cb) {
  return {
    type: 'fork',
    fn: cb
  }
}
function runForkEffect(effect,next) {
  task(effect.fn || effect);
  next();
}
function task(generator) {
  const it = typeof generator === 'function' ? generator() : generator;
  function next(value) {
    const result = it.next(value);
    if(!result.done) {
      const effect = result.value;
      //yield 一个生成器，校验不算严格
      if(typeof effect[Symbol.iterator] === 'function') {
        runForkEffect(effect,next);
      }else{
        switch(effect.type) {
          case 'take':
            runTakeEffect(effect,next);
            break;
          case 'fork':
            runForkEffect(effect,next);
            break;
        }
      }
      // if(effect.type === 'take') {
      //   runTakeEffect(effect,next);
      // }
    }
  }
  next();
}
function *mainSaga(){
  //监听一个action
  // const action = yield take();
  // console.log(action);
  //监听所有的action
  yield takeEvery(action => {
    console.log(action);
  })
}
task(mainSaga);

var eventcount = 1;
//模拟事件发起动作
// setTimeout(() => {
//   chan.put('action110');
// }, 1000);
var timer = setInterval(() => {
  if(eventcount < 4) {
    chan.put('action' + eventcount++);
  }else{
    clearInterval(timer);
  }
},1000)

//pull && push
