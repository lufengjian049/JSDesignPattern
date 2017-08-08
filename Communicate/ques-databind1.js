//数据绑定，双向数据绑定，发布订阅者模式
function Databind(object_id){
    var callbacks = {}
    var pubSub = {
        on:function(msg,callback){
            callbacks[msg] || (callbacks[msg] = [])
            callbacks[msg].push(callback)
        },
        fire:function(msg){
            if(callbacks[msg]){
                callbacks[msg].forEach(function(callback) {
                    callback.apply(this,[].slice.call(arguments,1))
                }, this);
            }
        }
    },
    data_attr = "data-bind" + object_id,
    message = object_id + ":change",
    changeHandle = function(event){
        //找到正确的元素（绑定了 data-bind-* 属性）
        var target = event.target || event.srcElement,
            propName = target.getAttribute(data_attr)
        //找到 之后 触发 订阅事件
        if(propName){
            pubSub.fire(message,propName,target.value)
        }
    }
    //监听变化事件，并代理到我们的发布订阅模式
    if(document.addEventListener){
        document.addEventListener("change",changeHandle,false)
    }else{
        document.attachEvent("onchange",changeHandle)
    }
    //订阅事件，去更新 所有相关的元素
    pubSub.on(message,function(propname,val){
        var elements = document.querySelectorAll("["+data_attr+"="+propname+"]"),
            tag_name;
        for(var i = 0;i<elements.length;i++){
            tag_name = elements[i].tagName.toLowerCase()
            if(~['input','select','textarea'].indexOf(tag_name)){
                elements[i].value = val
            }else{
                elements[i].innerHTML = val
            }
        }
    })
    return pubSub
}
//建立一个模型 model
function User(uid){
    var bind = Databind(uid),
        user = {
            attributes: {},
            set:function(propname,val){
                this.attributes[propname] = val
                bind.fire(uid+':change',propname,val,this)
            },
            get:function(propname){
                return this.attributes[propname]
            },
            _binder:bind
        }
    bind.on(uid+':change',function(propname,val,initial){
        if(initial != user){
            user.set(propname,val)
        }
    })
}

var user = User(123)
user.set("test",'11111')

//html
// <input data-bind-123="test" />
