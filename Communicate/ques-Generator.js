//从iterator -> generator
//iterator {next: function(){},throw:() => (),return:() => {}}
//iterable(可迭代对象) {[Symbol.iterator]: function() {}} 迭代器生成函数; for...of 需要

//function *foo() {};就是一个迭代器生成函数；可用于Symbol.iterator定义
//yield才有暂停的功能，yield *不具备暂停的功能，只是一个行为委托
//yield和next(...)的双向消息传递；yield： 给你一个表达式,你去用，接下来我要怎么处理？ next(传递处理)
//调用生成器函数返回的是一个iterator 同时也是一个iterable，因为iterator有个[Symbol.iterator]: () => {return this},所以可以用于for ... of,等消费值得方法

//generator的自执行
function runner(gen) {
  const args = [].slice.call(arguments,1);
  const it = gen(args);
  return Promise.resolve().then(function handleNext(value) {
    const result = it.next(value);
    // console.log('handlenext',result);
    return (function handleResult(next) {
      if(next.done) {
        return next.value;
      }
      if(typeof next.value === 'function') {//thunkify callback
        return new Promise((resolve,reject) => {
          next.value(function(err,value) {
            if(err) {
              reject(err);
            }
            resolve(value);
          });
        }).then(handleNext,function handleError(err) {
          return Promise.resolve(it.throw(err)).then(handleResult);
        });
      }
      return Promise.resolve(next.value).then(handleNext,function handleError(err) {
        // it.throw(err),会前进
        return Promise.resolve(it.throw(err)).then(handleResult)
      });
    })(result)
  });
}
function getpro(value,error = false) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      error ? reject('t1error') : resolve(value)
    },1000)
  })
}
function *test() {
  try{
    var t1 = yield getpro('111',true);
  }catch(e) {
    console.log('catch t1 error',e);
  }
  console.log('t1',t1);
  var t2 = yield getpro('222');
  console.log('t2',t2);
  return 'end';
}
runner(test).then(val => console.log(val));

const obj = {
  *[Symbol.iterator]() {
    yield 1
    yield 2
    yield 3
  }
}

for(var val of obj) {
  console.log('for..of-',val);
}