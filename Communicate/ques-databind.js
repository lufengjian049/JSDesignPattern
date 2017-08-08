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

//getter setter
function observable(provider){
  for(var prop in provider){
    observableProp(provider,prop);
    if(typeof provider[prop] == 'object'){
      observable(provider[prop])
    }
  }
}
function observableProp(provider,prop){
  
}
const observeProvider = observable({
  test:'test',
  text:'text'
})
observe(() => {
  console.log(observeProvider.test + '--' + observeProvider.text)
})
