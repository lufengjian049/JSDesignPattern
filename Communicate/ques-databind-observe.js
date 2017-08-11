//收集依赖 -> 数据绑定
let currentObserve;

//数据结构 observes -> WeakMap(key:obj) -> Map(key:obj.key) -> Set(observes)
//将observeable对象的属性映射到那些使用了这些属性的observe函数集合中
const observes = new WeakMap()
//转化为可观察对象
function observeable(obj){
  observes.set(obj,new Map())
  return new Proxy(obj,{get,set})
}
function get(target,key,receiver){
  // console.log(target,key)
  var result = Reflect.get(target,key,receiver)
  if(currentObserve){
    registerObserve(target,key,currentObserve)
    //运用递归 支持 属性值为对象的情况
    if(typeof result == 'object'){
      var observeResult = observeable(result)
      Reflect.set(target,key,observeResult,receiver)
      return observeResult
    }
  }
  return result
}
//获取到所有与 key 相关的 observe,加入到执行队列中
//注意：set时获取到的 target 只是相对key的一层(当前)对象
function set(target,key,value,receiver){
  console.log('set:',target,key)
  var observesForKey = observes.get(target).get(key)
  if(observesForKey){
    observesForKey.forEach(queueObserve)
  }
  return Reflect.set(target,key,value,receiver)
}
//将与当前属性key相关的observe函数 添加到 队列中,注意 set 主要是防止重复添加的情况
function registerObserve(target,key,observe){
  var observesForKey = observes.get(target).get(key)
  if(!observesForKey){
    observesForKey = new Set()
    observes.get(target).set(key,observesForKey)
  }
  observesForKey.add(observe)
}

//observe
//将要执行的observe队列
const queuedObserves = new Set()
//注意 队列是 分批 异步执行
function observe(fn){
  if(typeof fn != "function"){
    throw new Error("must be function")
  }
  queueObserve(fn)
}
//加入队列 异步执行队列
function queueObserve(observe){
  //队列为空时，注册 异步处理函数
  if(queuedObserves.size == 0){
    Promise.resolve().then(runObserves)
  }
  queuedObserves.add(observe)
}
function runObserves(){
  console.log('queue length',queuedObserves.size)
  // queue length 2
  try{
    queuedObserves.forEach(runObserve)
  }finally{
    currentObserve = null
    queuedObserves.clear()
  }
}
function runObserve(observe){
  currentObserve = observe
  observe()
}

//防止 多次包装，判断包装对象是否是observeable

//test
// var test = observeable({
//   test:'test1111',
//   text:'msgmsg'
// })
// observe(function(){
//   console.log('test and text:',test.test,test.text)
// })
// observe(function(){
//   console.log('we console text msg:',test.text)
// })
// setTimeout(() => {
//   test.text = "change text haha。。。"
// },1000)
// setTimeout(() => {
//   test.test = "test2222"
// },2000)

var person = observeable({data:{name:'test'}})
observe(function(){
  console.log('person data',person.data)
})
setTimeout(() => {
  person.data.newproperty = 'newproperty'
  console.log(person)
},1000)