//背景，手机扫码，移入显示，移出隐藏
//鼠标移入时，防止误操作，应该不要立即显示，延迟展示；而移出的时候，如果时间比较短，防止误操作，应该延迟浮层的隐藏

// html结构
// <div id="icon" class="icon">
//     <ul class="icon">
//         <li class="weibo"></li>
//         <li class="weixin"></li>
//     </ul>
//     <div class="">
//         <img class="show" src="imgs/weibo.png" alt="" />
//         <img class="" src="imgs/weixin.png" alt="" />
//         <span class="arrow"><em></em></span>
//     </div>
// </div>

//外观模式封装获取元素的方法
function $(id){
    return document.getElementById(id);
}
function $tag(tag,container){
    container = container || document;
    return container.getElementsByTagName(tag);
}
//浮层类
var Layer = function(id){
    this.container = $(id);

    //获取浮层容器
    this.layer = $tag('div',this.container)[0];
    //获取icon容器
    this.lis = $tag('li',this.container);
    //获取二维码图片
    this.imags = $tag("img",this.container);
    //绑定事件
    this.bindEvent();
}
Layer.prototype = {
    bindEvent:function(){
        var that = this;
        var hideLayer = function(){
            this.layer.className = '';
        },
        showLayer = function(){
            this.layer.className = 'show';
        }
        //运用事件的委托-----
        that.on(that.container,'mouseenter',function(){
            //清除隐藏浮层方法的计时器
            throttler(true,hideLayer);//防止移出又迅速移入的情况，清除掉关闭的定时器
            throttler(showLayer);
        }).on(that.container,"mouseleave",function(){
            
            throttler(hideLayer);

            throttler(true,showLayer);
        })

        //遍历icon绑定事件
        for(var i=0;i<that.lis.length;i++){
            that.lis[i].index = i;
            that.on(that.lis[i],'mouseenter',function(){
                var index = this.index;

                for(var i=0;i<that.imgs.length;i++){
                    that.imgs[i].className = "";
                }
                that.imgs[index].className = 'show';
                that.layer.style.left = -22 + 60 * index + "px";
            })
        }
    },
    //事件绑定
    on:function(ele,type,fn){
        ele.addEventListener ? ele.addEventListener(type,fn,false) : ele.attachEvent('on'+type,fn);
        return this;
    }
}

new Layer("icon")

