//代码求值-目标，所有的变量寻找都在一个沙箱内，不会访问全局、闭包中的变量

//eval() 可以访问闭包中的变量和全局作用域中的变量

//new Function(...args,fnBody) 会阻止访问闭包中的变量，但还是会访问全局的变量

// function test(src){
//   return new Function('return src')
// }
// console.log(test("test...")())
//Error, src not defined

//with 扩展作用域
function compileCode1(src){
  src = "with(sandbox){"+src+"}"
  return new Function("sandbox",src)
}
//首先在with沙箱中找变量，因Function阻止访问闭包中变量，但还是会找全局的变量，所以只要控制住sandbox对象，检查sandbox用的是 in 操作

// function compileCode2(src){
//   src = "var proxy = new Proxy(sandbox,{has:function(){return true}});with(proxy){"+src+"}"
//   return new Function('sandbox',src)
// }

function compileCode2(src){
  src = "with(sandbox){"+src+"}"
  var code = new Function("sandbox",src)
  return function(sandbox){
    var sandboxProxy = new Proxy(sandbox,{has,get})
    return code(sandboxProxy)
  }
}
function has(target,key){
  return true
}
function get(target,key){
  if(key == Symbol.unscopables)
    return undefined
  return target[key]
}
//Symbol.unscopables 用于指定对象的一些固有和继承属性，这些属性被排除在 with 所绑定的环境之外 无法读取，因为无法读取，所以会往上找
//如果要找 Symbol.unscopables 属性，但是在with中是访问不到，就会往上找

//性能问题，每一个sandbox对象进来，都会创建一个proxy对象，如果对象相同就会造成浪费，所有还是要缓存

//WeakMap 可以在不直接扩展对象属性的情况下，为对象添加数据
var sandboxProxys = new WeakMap()
function compileCode(src){
  src = "with(sandbox){"+src+"}"
  var code = new Function("sandbox",src)
  return function(sandbox){
    if(!sandboxProxys.has(sandbox)){
      var sandboxProxy = new Proxy(sandbox,{has,get})
      sandboxProxys.set(sandbox,sandboxProxy)
    }
    return code(sandboxProxys.get(sandbox))
  }
}
