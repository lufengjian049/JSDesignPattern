//命令模式
//将请求与实现解耦并封装成独立对象，从而使不同的请求对客户端实现参数化

var viewCommand = (function(){
    var tpl = {
        product:[
            '<div>',
                '<img src="{#src#}" />',
                '<p>{#text#}</p>',
            '</div>'
        ].join(''),
        //展示标题结构模板
        title:[
            '<div class="title">',
                '<div class="main">',
                    '<h2>{#title#}</h2>',
                    '<p>{#tips#}</p>',
                '</div>',
            '</div>'
        ].join("")
    },
    //格式化字符串缓存字符串
    html = '';

    function formateString(str,obj){
        return str.replace(/\{#(\w+)#\}/g,function(match,key){
            return obj[key];
        })
    }

    var Action = {
        create:function(data,view){
            if(data.length){
                for(var i=0,len = data.length;i<len;i++){
                    html += formateString(tpl[view],data[i]);
                }
            }else{
                html += formateString(tpl[view],data);
            }
        },
        display:function(container,data,view){
            if(data){
                this.create(data,view);
            }
            document.getElementById(container).innerHTML = html;

            html = "";
        }
    };
    // msg{command:"",param:[]}
    return function excute(msg){
        //如果msg.param不是数组则将其转化为数组，因为apply方法要求第二个参数必须为数组
        msg.param = Object.prototype.toString.call(msg.param) === "[object Array]" ? msg.param : [msg.param];
        //Action内部调用方法引用了this，所以此处为保证作用域this执行 传入Action
        Action[msg.command].apply(Action,msg.param);
    }
})();

var titleData = {
    title:"",
    tips:""
}
//使用
viewCommand({
    command:"display",
    param:["titleContainer",titleData,'title']
})
//当然如果想 展示多条数据 ，data 可以传入数组

//也用于解耦，将canvas的上下文引用对象封装在对象内部
var CanvasCommand = (function(){
    var canvas  = document.getElementById("canvas"),
        ctx = canvas.getContext('2d');
    
    var Action = {
        //填充色彩
        fillStyle:function(c){
            ctx.fillStyle = c;
        },
        fillRect:function(x,y,width,height){
            ctx.fillRect(x,y,width,height);
        },
        strokeStyle:function(c){
            ctx.strokeStyle = c;
        },
        strokeRect:function(x,y,width,height){
            ctx.strokeRect(x,y,width,height);
        },
        //等等
    };
    return {
        excute:function(msg){
            if(!msg)
                return;
            if(msg.length){
                for(var i=0,len=msg.length;i<len;i++){
                    arguments.callee(msg[i]);  // 遍历执行多条命令  arguments.callee 指向当前正在执行的函数
                }
            }else{
                msg.param = Object.prototype.toString.call(msg.param) === "[object Array]" ? msg.param : [msg.param];
                Action[msg.command].apply(Action,msg.param);
            }
        }

    }
})();

CanvasCommand.excute([
    {command:"fillStyle",param:"red"},
    {command:"fillRect",param:[20,20,100,100]}
])

//命令模式，将执行的命令封装，提供高效的api
//一条命令 就是一条操作