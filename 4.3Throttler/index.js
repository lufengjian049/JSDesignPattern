//节流模式
//对重复业务逻辑进行节流控制，执行最后一次操作并取消其他操作，以提高性能

var throttler =  function(){
    var isClear = arguments[0],
        fn;
    
    if(typeof isClear === 'boolean'){
        fn = arguments[1];
        //函数的延时器的句柄存在，则清楚该计时器
        fn.__throttlerID && clearTimeout(fn.__throttlerID);
    }else{
        //第一个参数为函数
        fn = isClear;
        //第二个参数为函数执行时的参数
        param = arguments[1];

        var p = Object.assign({},{
            context:null,   //执行函数执行时的作用域
            args:[],        //执行函数执行时的相关参数
            time:300        //延迟时间
        },param);

        //清除执行函数计时器句柄（多次触发时，要先清除之前的一系列计时器句柄，只保留最后一次的计时器句柄）
        fn.__throttlerID = setTimeout(function(){
            fn.apply(p.context,p.args);
        },p.time);
    }
}

//滚动条 滚到运用节流 防止动画跳动

function moveScroll(){
    var top = $(document).scrollTop();
    $("#back").animate({top:top+300},400,'easeOutCubic');
}

$(window).on("scroll",function(){
    throttler(moveScroll);
    //节流返回顶部的动画
})