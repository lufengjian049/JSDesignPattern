//备忘录模式
//缓存数据，以便使用

var Page = function(){
    var cache = {};
    return function(page){
        if(cache[page]){

        }else{
            cache[page] = data;
        }
    }
}();