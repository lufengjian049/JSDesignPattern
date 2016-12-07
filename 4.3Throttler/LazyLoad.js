//图片延时加载
//id 延迟加载图片的容器id
//图片格式如下:<img src="img/loading.gif" alt="" data-src="img/1.png" />
function LazyLoad(id){
    this.container = document.getElementById(id);

    this.imgs = this.getImgs();

    this.init();
}

LazyLoad.prototype = {
    init:function(){
        //加载当前视图图片
        this.update();
        this.bindEvent();
    },
    getImgs:function(){
        var arr = [];
        var imgs = this.container.getElementsByTagName("img");
        //获取到的图片转为数组(IE下Array.prototype.slice会报错)
        for(var i=0,len=imgs.length;i<len;i++){
            arr.push(imgs[i]);
        }
        return arr;
    },
    //加载图片
    update:function(){
        //对处在可视区域的图片加载并将其在图片缓存中删除
        if(!this.imgs.length){
            return;
        }
        var i = this.imgs.length;
        for(--i;i>=0;i--){
            if(this.shouldShow(i)){
                this.imgs[i].src = this.imgs[i].getAttribute("data-src");
                this.imgs.splice(i,1);
            }
        }
    },
    //判断图片是否在可是范围内
    shouldShow:function(i){
        var img = this.imgs[i],
            //可视范围内顶部高度
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            scrollBottom = scrollTop + document.documentElement.clientHeight,
            //图片顶部位置
            imgTop = this.pageY(img),
            imgBottom = imgTop + img.offsetHeight;
        //是否在可是区域内，图片底部的高度大于可视区域顶部高度并且图片底部高度小于可视区域底部高度，或者。。
        if(imgBottom > scrollTop && imgBottom < scrollBottom || (imgTop > scrollTop && imgTop < scrollBottom))
            return true;
        return false;

    },
    //获取元素页面中的纵坐标位置
    pageY:function(element){
        //通过元素一级一级遍历其父元素，并累加每一级元素offsetTop值
        if(element.offsetParent){
            return element.offsetTop + this.pageY(element.offsetParent);
        }else{
            return element.offsetTop;
        }
    },
    on:function(element,type,fn){
        ele.addEventListener ? ele.addEventListener(type,fn,false) : ele.attachEvent('on'+type,fn);
        return this;
    },
    //为窗口绑定resize和scroll事件
    bindEvent:function(){
        var that = this;
        this.on(window,"resize",function(){
            throttler(that.update,{context:that});
        })
        this.on(window,"scroll",function(){
            throttler(that.update,{context:that});
        })
    }
}

new LazyLoad("container");

//offsetParent 为上层元素 设置了定位属性(relative /  absolute ) ,没有 则为 根元素
// offsetLeft 也就是返回对象元素边界的左上角顶点相对于offsetParent的左上角顶点的水平偏移量。
// 从这个定义中我们可以明确地知道offsetLeft与当前元素的margin-left和offsetParent的padding-left有关。
// 也就是说应该是：

// 　　offsetLeft=(offsetParent的padding-left)+(中间元素的offsetWidth)+(当前元素的margin-left)。

// 　　offsetTop=(offsetParent的padding-top)+(中间元素的offsetHeight)+(当前元素的margin-top)。

// offsetWidth=(border-width)*2+(padding-left)+(width)+(padding-right)

// 　　offsetHeight=(border-width)*2+(padding-top)+(height)+(padding-bottom)