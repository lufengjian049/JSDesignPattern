//委托模式
//多个对象接收并处理同一请求，他们讲请求委托给另一个对象统一处理请求

//事件委托 委托给父元素减少 定义的事件数，通过target去区分

//用委托模式封装一个事件委托方法，使用方法如下
delegate(document.body,'button','click',function () {
    console.log('委托成功')
})

//e.target || e.srcElement  nodeName