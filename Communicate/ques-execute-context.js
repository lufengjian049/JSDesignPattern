var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
//调用栈
//golbal execute ->
//创建一个golbalContext,并压入调用栈
//golbalContext初始化(上下文初始化主要包括，变量对象，作用域链，this)
//初始化的同时，函数被创建，函数内部的[[scope]] = 父级的作用域链
//function execute -> 压栈
//进入执行上下文，执行上下文要做一些准备工作，分为分析和执行两个阶段
//分析-执行上下文初始化，(就是一个上下文对象，checkscopeContext = {})
//    将[[scope]]复制到scope属性
//    用arguments创建一个VO
//    将VO初始化，加入形参，函数声明，变量声明
//    将VO压入scope属性的 顶端

// checkscopeContext = {
    //  arguments：{
    //    length:0,
    //  }，
//   VO:{

//   },
//   scope:[VO, [[scope]] ],
//   this:undefined
// }

//执行阶段，VO -> AO,活动对象里面的值进行真正的初始化赋值操作
//this的值 在函数执行的时候才确定
function test(){
  var n = 99;
  return function(){
    n++
    console.log(n)
  }
}
var a1 = test()
var a2 = test() //应该是又创建了一个执行上下文
console.log('a1')
a1() //100
a1() //101
console.log('a2')
a2() //100
a2() //101
//两个不同的执行上下文，所以闭包变量 相互独立
//同一个函数形成的多个闭包的值都是相互独立的
let nAdd;
let t = () => {
    let n = 99;
    nAdd = () => {
        n++;
    };
    let t2 = () => {
        console.log(n);
    };
    return t2;
};

let a11 = t();
let a21 = t();

nAdd();
a11();    //99
a21();    //100

