//扩展方法
function contains(target,it){
    //indexOf
}
function startsWith(target,str,ignorecase){

}
function endsWith(target,str,ignorecase){

}
//性能测试 benchmark.js  jsPerf.com
function repeat(target,n){
    //1.空数组join
    //2.通过类数组对象，省去创建数组的过程
    //3.第二个方法的改良，闭包缓存
    //4.算法 二分法
    var s = target, total = [];
    while(n > 0){
        if( n % 2 == 1)
            total[total.length] = s 
        if(n == 1)
            break
        s += s
        n = n >> 1; // = n除以2取其商，不是 n / 2,= Math.floor(n / 2)
    }
    return total.join('')
    //5.将上面稍微改良，性能最好
    //6.递归
}
//取字符串的字节长度
function byteLen(target){
    //charCodeAt(i)
    //1.默认非中文字符Unicode编码 <= 255; 否则认为是中文占两个字节
    //2.正则，还是支持制定汉字的存储字节，默认是2， /[^\x00-\xff]/g
    //3.最严谨的统计，utf-8 <= 0x007f, 1 0x07ff 2,0xffff 3,4
    //utf-16 <= 0xffff 2,4
}
//对字符进行截断
function truncate(target,length,truncation){//超出默认按 ... 进行补充
    length = length || 30


}
//转为驼峰格式 xxx-xxx => xxxXxx , xxx_xxx => xxxXxx
function camelize(target){
    //提前判断，过滤不符合规范的
    // /[-_][^-_]/g
}
//转下划线风格,最后统一都转小写
function undersored(target){
    //"dsdsAbc".replace(/([a-z\d])([A-Z])/g,'$1_$2')
}
//转换为连字符风格, 将上面下划线 => -
function dasherize(target){

}
//首字母大写
function capitalize(target){

}
//移除字符串中 html标签,要做好兼容，target没有的情况
function stripTags(target){
    // /<[^>]+>/g
}
//上面的方法有一个缺陷，会将script标签内的脚本也显示出来了。。。要在stripTags之前调下面方法
function stripScripts(target){
    //  /<script[^>]*>([\S\s]*?)<\/script>/img
}
//将html转义
function escapeHTML(target){
    return target.replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g,'&quot;')
                .replace(/'/g,'&#39;')
}
function unescapeHTML(target){

}
//某端填充字符,先默认填充 0 ，length为 总长度
function pad(target,length){
    //在字符左边 添加 多的 00，然后在右边进行 length 截取 substr(-n)
    // 有数组补充，Math.pow(10,n),1 << n 相等于 2的n次方，0..toFixed(n)
    //循环 添加
}
function pad2(target,length,filling,right,radix){

}
//格式化  #{}
function format(str,object){
    //  /\\?\#{([^{}]+)\}/gm
}