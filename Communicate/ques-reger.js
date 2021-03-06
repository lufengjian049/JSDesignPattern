//字符组，范围，排除
//量词，有限量词，惰性量词
//分组括号，分组，引用，反向引用，非捕获
//断言，位置，单词边界，环视

//字符组，优先量词，惰性量词
//匹配标签
var tagreg = /<tr(?:\s+[^>]*)?>[\s\S]*?<\/tr>/;
tagreg = /<tr[\s\S]+?<\/tr>/; //会匹配出不标准的标签！！！
//提取所有a连接
var areg = /<a(?:\s+[^>]*)?>[\s\S]*?<\/a>/g;
//文件名的解析，/usr/local/bin/python,解析出路径：/usr/local/bin/ 和文件名 python
var reg = /^.*\//;
reg = /[^\/]+$/;
//准确匹配open tag(头尾都没有/)
tagreg = /<[^\/]([^>]*[^\/])?>/g;
//提取a链，href 信息
reg = /<a\s+[^>]*?href=['"]?([^'"]+)['"]?[^>]*?>[\s\S]*?<\/a>/;
//提取图片地址信息
reg = /<img\s+[^>]*?src=['"]?([^'"]+)['"]?[^>]*?\/?>/;

//https://github.com/callumacrae/regex-tuesday
//https://github.com/jawil/blog/issues/20

//4. /([^\*]|^)\*(?!\*)([\s\S]+?)([^\*])\*(?!\*)/g  $1<em>$2$3</em>
//域名协议: 域名中只允许中间出现  - 
//7. /^https?:\/\/[a-z0-9](?:[a-z0-9-]{0,61}?[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}?[a-z0-9])?)+\/?$/i
//http://www.cnblogs.com/ziyunfei/archive/2012/10/18/2729163.html
//替换，找目标字符
reg = /^\*\s+([\w\s]*)$(?=\*\s+\1)/mi;
//整体匹配(有相互关系)， 匹配换行 多行匹配 (多行重复情形)
reg = /^(. (.+))$(\n)\S(\s+)(\2)$/mig;  //替换 $1$3*$4**$5**
//markdown链接语法替换为a链
reg = /(\s|^)\[([^\[\]]+)\]\((http:\/\/[a-zA-Z0-9-]+(?:\.[a-zA-Z-]+)+\/?)\)(\s|$)/;

reg = /\s["'](.+?)["']|\s'|'\s|[\s;]+|-{2,}/g; //替换 ,$1
//    /\s("|')(.*?)\1|\W?\s\W?|-{2,}/g  替换为   ,$2 
reg = /^a? *b? *c? *d? *e? *f? *g? *h? *i? *j? *k? *l? *m? *n? *o? *p? *q? *r? *s? *t? *u? *v? *w? *x? *y? *z? *$/;
//单词之间一个，句号后面两个空格。
reg = /\s+|(\.\s)\s*/g; //替换的文本为 $1+space
//匹配回文字符
reg = /^(.?)(.?)(.?)(.?)(.?)(.?)(.?)(.?)(.?).?\9\8\7\6\5\4\3\2\1$/;

reg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])^[0-9a-zA-Z]{6,12}$/;
//中文  ^[\u4e00-\u9fa5]$
//双字节，统计字符串长度 [^\x00-\xff] 替换为 --
console.log(reg.test("dsA3)332ds"));

// 工具集合  https://juejin.im/entry/59599a46f265da6c2915912b
