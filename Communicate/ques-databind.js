// 数据绑定是将数据源与数据提供者、消费者绑定并在它们之间保持同步的一种基本技术。
// //数据提供者
// var provider = {
//   message:'test'
// }
// //监听，将数据提供者的 属性 映射到一个handle,监听属性的变量，调用对应的handle
// function observe(provider,prop,handle){
//   provider._handlers || (provider._handlers = {})
//   provider._handlers[prop] = handle
// }
// //脏检查，循环检查，属性是否与上一次循环时的值是否相同，不同则调用handle

// function digest(){
//   providers.forEach(digestProvider)
// }
// function digestProvider(provider){
//   //注意，只对 绑定handle 的属性 进行脏检查
//   for(var prop in provider._handlers){
//     provider._prevProp || (provider._prevProp = {})
//     if(provider._prevProp[prop] != provider[prop]){
//       provider._prevProp[prop] = provider[prop]
//       provider._handlers[prop](provider[prop])
//     }
//   }
// }


// var providers = [provider]
// observe(provider,'message',function(msg){
//   console.log('change property',msg)
// })
// digest()
// provider.message = "changed test"
// digest()
//provider => observable可观察对象
//提前 设置访问器属性，会有性能问题，是否可以后置，再需要的时候才去设置
//getter setter
let currentHandle = null;
function observable(provider){
  for(var prop in provider){
    observableProp(provider,prop);
    if(typeof provider[prop] == 'object'){
      observable(provider[prop])
    }
  }
}
function observableProp(provider,prop){
  let value = provider[prop]
  Object.defineProperty(provider,prop,{
    get() {
      //获取属性时，动态绑定handle
      if(currentHandle) {
        provider._handles || (provider._handles = {});
        provider._handles[prop] = currentHandle;
      }
      return value
    },
    set(newvalue) {
      value = newvalue;
      const handle = provider._handles && provider._handles[prop];
      currentHandle = handle;
      handle();
      currentHandle = null;
    }
  })
}
function observe(handle) {
  currentHandle = handle;
  handle();
  currentHandle = null;
}
const observeProvider = observable({
  test:'test',
  text:'text'
})
observe(() => {
  console.log(observeProvider.test + '--' + observeProvider.text)
})
//get 收集依赖
//set 取出依赖，执行