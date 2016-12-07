//MVVM模式

//<div class="first" data-bind="type:'slide',data:demo1"></div>
//<div class="second" data-bind="type:'slide',data:demo2"></div>
//<div class="third" data-bind="type:'progressbar',data:demo3"></div>
//<div class="forth" data-bind="type:dropdownselect">

//实现 视图模型层
~(function () {
    //在闭包中获取全局变量
    var window = this || (0,eval)('this');
    //获取页面字体大小，作为创建页面UI尺寸参照物
    var FONTSIZE = function(){
        return parseInt(document.body.currentStyle ? document.body.currentStyle['fontSize'] : getComputedStyle(document.body,false)['fontSize']);
    }();
    //视图模型对象
    var VM = function(){
        //组件创建策略对象
        var Method = {
            slider:function(dom,data){
                var bar = document.createElement('span');
                //。。。
                var setStyle = function(w){
                    progress.style.width = w + 'px';
                    bar.style.left = w -FONTSIZE/2 + 'px';
                    if(progressText){

                    }
                }
                bar.onmousedown = function(){
                    //事件绑定给document是为了优化交互体验，使鼠标光标可以在页面中自由滑动
                    document.onmousemove = function(event){
                        var e = event || window.event;
                        var w = e.clientX - left;
                        setStyle(w<width ? (w>0 ? w : 0 ) : width);
                    }
                    //阻止页面滑动选取事件
                    document.onselectstart = function(){
                        return false;
                    }
                    //停止滑动交互
                    document.onmouseup = function(){
                        //取消一系列事件
                        document.onmousemove = null;
                        document.onselectstart = null;
                    }
                }
            },
            progressbar:function(dom,data){
                var progress = document.createElement('div'),
                    param = data.data;
                progress.style.width = (param.position || 100) + "%";
                dom.className += 'ui-progressbar';
                dom.appendChild(progress);
            }
        }
        //获取视图层组件渲染数据的映射信息
        function getBindData(dom){
            var data = dom.getAttribute("data-bind");
            //将自定义属性data-bind转为对象
            return !!data && (new Function("return ({"+ data +"})"))();
        }
        return function(){ //初始化执行 页面中所有定义的 类型
            var doms = document.getElemensByTagName("*"),
                ctx = null;
            for(var i =0;i<doms.length;i++){
                ctx = getBindData(doms[i]);
                ctx.type && Method[ctx.type] && Method[ctx.type](doms[i],ctx);
            }
        }
    }();
    //将视图模型对象绑定在window上
    window.VM = VM;
})

var dome1 = {
    position:60,
    totle:200
}
demo2 = {
    position : 20
}
demo3={
    position:50
}
window.onload = function(){
    //渲染组件
    VM();
}

//运用MVVM，创建带有下拉框功能的输入框组件