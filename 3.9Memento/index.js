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

//适用场景：请求数据的缓存，作为一个全局的 私有 缓存