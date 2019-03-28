/**
 * Created by lufj on 2016/8/25.
 */
var c = document.getElementsByTagName('CANVAS')[0];
var ctx = c.getContext('2d');

var drawCircle = function (deg) {
    ctx.lineWidth = 6;

    for(var i = 1; i < 361; i++) {
        var red   = 255;
        var green = 124;
        var blue  = 36;
        var alpha = i / 360 ;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + [red, green, blue, alpha].join(',') + ')';
        ctx.arc(50, 50, 30, (i - 1 + deg) * Math.PI / 180, (i + deg) * Math.PI / 180);
        ctx.stroke();
    }
};

var deg = 0,
    dis = 10;
var id = setInterval(function() {
    ctx.clearRect(0,0,400,300);
    deg += dis;
    if (deg > 360) { //完成一个圆的绘制后重新开始绘制
        deg = 0;
    }

    drawCircle(deg);
}, 16);