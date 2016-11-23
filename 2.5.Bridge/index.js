//桥接模式
//抽象提取共用部分，然后将实现与抽象通过桥接方法连接在一起，来实现解耦的作用

//事件与业务逻辑之间 通过 匿名函数就行桥接

var spans = document.getElementsByTagName("span");

spans[0].onmouseout = function(){
    ChangeColor(this,'red',"#ddd");
}

function ChangeColor(dom,color,bg){
    dom.style.color = color;
    dom.style.background = bg;
}

//将实现层与抽象层解耦分离，两部分可以独立变化