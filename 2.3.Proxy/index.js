//代理模式
//由于一个对象不能直接引用另一个对象，所以需要通过代理对象在这两个对象中间起到中介的作用

//跨域

//img的src属性，可以向其它域发送请求，不过这类只是get请求，是单向的，不会有响应数据

//站长统计

var Count = (function(){
    var img = new Image();
    return function(param){
        var str = 'http://count.com/a.gif?';
        for(var i in param){
            str += i + "="+param[i]+"&";
        }
        str = str.slice(0,-1);
        img.src = str;
    }
})();


