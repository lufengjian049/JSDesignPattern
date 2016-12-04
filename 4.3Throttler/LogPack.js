//统计打包
//当触发次数大于一定值时才发送请求

var LogPack = function(){
    var data = [],
        MaxNum = 10,
        itemSplitStr = '|',
        keyValueSplitStr = "*",
        img = new Image(); //通过img的src发送简单请求
    
    function sendLog(){
        var logStr = "",
            fireData = data.splice(0,MaxNum);
        
        for(var i=0,len=fireData.length;i<len;i++){
            logStr += 'log' + i + "=";
            for(var j in fireData[i]){
                logStr += j + keyValueSplitStr + fireData[i][j];
                logStr += itemSplitStr;
            }
            logStr = logStr.replace(/\|$/,'') + "&";
        }
        logStr += 'logLength='+len;
        img.src = 'a.gif?'+logStr;
    }

    return function(param){
        if(!param){
            sendLog();
            return;
        }
        data.push(param);
        data.length >= MaxNum && sendLog();
    }
}();

//点击统计
btn.onClick = function(){
    LogPack({
        btnId:this.id,
        context : this.innetHTML,
        type:"ok"
    })
}