//扩展方法
function contains(target,it){
    return !!(target && it && ~target.indexOf(it))
}
console.log(contains())
console.log(contains("test"))
console.log(contains("test",'es'))
console.log(contains("test",'et'))
function startsWith(target,str,ignorecase){
    //默认全匹配，ignorecase=false
    //1.
    var len = (str || "").length,
        cstr = (target || "").substr(0,len)
    return !!(cstr && (ignorecase ? cstr.toLowerCase() === str.toLowerCase() : cstr === str))
    //2.
    // if(ignorecase){
    //     target = target.toLowerCase()
    //     str = str.toLowerCase()
    // }
    // return !!(target && str && target.indexOf(str) === 0)
}
console.log('startsWith')
console.log(startsWith("test"))
console.log(startsWith())
console.log(startsWith("test",'te'))
console.log(startsWith("test",'Te'))
console.log(startsWith("test",'Te',true))
console.log(startsWith("test",'ts'))
function endsWith(target,str,ignorecase){
    //1.
    // var len = (str || "").length,
    //     cstr = (target || "").substr(-len)
    // return !!(target && str && (ignorecase ? cstr.toLowerCase() === str.toLowerCase() : cstr === str))
    //2.
    if(ignorecase){
        target = target.toLowerCase()
        str = str.toLowerCase()
    }
    return !!(target && str && target.indexOf(str) === (target.length - str.length))
}
console.log('endsWith')
console.log(endsWith('test','st'))
console.log(endsWith('test','St'))
console.log(endsWith('test','St',true))
//性能测试 benchmark.js  jsPerf.com
function repeat(target,n){
    //1.空数组join
    // return (Array(n+1)).join(target) // (new Array(n+1)).join(target)
    //2.通过类数组对象，省去创建数组的过程
    // return [].join.call({length:n+1},target)
    //3.第二个方法的改良，闭包缓存,缓存[].join ,obj{}
    
    //4.算法 二分法
    // var s = target, total = [];
    // while(n > 0){
    //     if( n % 2 == 1)
    //         total[total.length] = s 
    //     if(n == 1)
    //         break
    //     s += s
    //     n = n >> 1; // = n除以2取其商，不是 n / 2,= Math.floor(n / 2)
    // }
    // return total.join('')
    //5.将上面稍微改良，性能最好
    // var s = target,total = "";
    // while(n > 0){
    //     if(n % 2 == 1)
    //         total += s
    //     if(n == 1)
    //         break
    //     s += s
    //     n = n >> 1
    // }
    // return total
    //6.递归
    return n ==0 ? "" : target.concat(repeat(target,--n))
}
console.log('repeat')
console.log(repeat('test',7))
//取字符串的字节长度
function byteLen(target){
    target = String(target || '')
    //charCodeAt(i)
    //1.默认非中文字符Unicode编码 <= 255; 否则认为是中文占两个字节
    // var bytelength = target.length
    // for(var i=0;i<bytelength;i++){
    //     if(target.charCodeAt(i) > 255)
    //         bytelength++
    // }
    // return bytelength
    //2.正则，还是支持制定汉字的存储字节，默认是2， /[^\x00-\xff]/g
    target = target.replace(/[^\x00-\xff]/g,'--')
    return target.length
    //3.最严谨的统计，utf-8 <= 0x007f, 1 0x07ff 2,0xffff 3,4
    //utf-16 <= 0xffff 2,4

}
console.log("byteLen")
console.log(byteLen("都是dd"))
//对字符进行截断
function truncate(target,length,truncation){//超出默认按 ... 进行补充
    length = length || 30
    truncation = truncation || '...'
    return target.length < length ? target : target.substr(0,length) + truncation
}
console.log("truncate")
console.log(truncate("testqwertyuiop",4))
console.log(truncate("testqwertyuiop",4,'~'))
console.log(truncate("test",5))
//转为驼峰格式 xxx-xxx => xxxXxx , xxx_xxx => xxxXxx
function camelize(target){
    //提前判断，过滤不符合规范的
    // /[-_][^-_]/g
    if(/[-_]/.test(target)){
        return target.replace(/[-_][^-_]/g,function(match){
            return match.charAt(1).toUpperCase()
        })
    }
    return target
}
console.log('camelize')
console.log(camelize("test-qq"))
console.log(camelize("test_qq"))
console.log(camelize("testqq"))
//转下划线风格,最后统一都转小写
function undersored(target){
    return target && target.replace(/([a-z\d])([A-Z])/g,"$1_$2").toLowerCase()
}
console.log("undersored")
console.log(undersored("ab2Def"))
//转换为连字符风格, 将上面下划线 => -
function dasherize(target){
    return target && target.replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase()
}
//首字母大写
function capitalize(target){
    // return target.charAt(0).toUpperCase() + target.substr(1).toLowerCase()
    return target && target.replace(/^[a-z]/,function(match){
        return match.toUpperCase()
    })
}
console.log("capitalize")
console.log(capitalize("1test test"))
function stripTags(target){
    return target && target.replace(/<[^>]+>/g,"")
}
console.log("stripTags")
console.log(stripTags("test<html>dsds</html>"))
//上面的方法有一个缺陷，会将script标签内的脚本也显示出来了。。。要在stripTags之前调下面方法
function stripScripts(target){
    return target && target.replace(/<script[^>]*>([\S\s]*?)<\/script>/img,'')
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
    //...
}
//某端填充字符,先默认填充 0 ，length为 总长度
function pad(target,length){
    if(target.length < length){
        // var leftpad = (Array(length)).join("0")
        // var leftpad = Math.pow(10,length).toString()
        // var leftpad = (1 << length).toString(2)
        var leftpad = 0..toFixed(length)
        return (leftpad + target).substr(-length)
    }else{
        return target
    }
}
console.log("pad")
console.log(pad("test",4))
console.log(pad("test",6))
function pad2(target,length,filling,right,radix){
    filling = filling || '0'
    target = target.toString(radix || 10)
    while(target.length < length){
        target = right ? (target + filling) : (filling + target)
    }
    return target
}
console.log("pad2")
console.log(pad2("test",6,"!"))
console.log(pad2("test",6,"!",true))
//格式化  #{}
function format(str,object){
    //  /\\?\#{([^{}]+)\}/gm
}