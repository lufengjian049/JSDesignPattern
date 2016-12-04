//简单模板模式
//通过格式化字符串拼凑出视图避免创建视图时大量节点操作。优化内存开销

//关键
var A = {};
A.formatString = function(str,data){
    return str.replace(/\{#(\w+)#\}/g,function(match,key){
        return typeof data[key] === void 0 ? "" : data[key];
    })
}
A.listPart = function(data){
    var s = document.createElement("div"),
        ul = "",
        ldata = data.data.li,
        //模块模板
        tpl = [
            '<h2>{#h2#}</h2>',
            '<p>{#p#}</p>',
            '<ul>{#ul#}</ul>'
        ].join(""),
        liTpl = [
            '<li>',
                '<strong>{#strong#}</strong>',
                '<span>{#span#}</span>',
            '</li>'
        ].join("");

//------运用 模板生成器方法
    // tpl = A.View(["h2","p","ul"])
    // liTpl = A.formatString(A.View('li'),{
    //     li:A.View(["strong","span"])
    // })
//------运用 模板生成器方法

    //有id设置模块id
    data.id && (s.id = data.id);
    for(var i=0,len=ldata.length;i<len;i++){
        if(ldata[i].em || ldata[i].span){
            ul += A.formatString(liTpl,ldata[i]);
        }
    }
    data.data.ul = ul;
    s.innerHTML = A.formatString(tpl,data.data);

    A.root.appendChild(s);
}

//模板生成器
A.View = function(name){
    //模板库
    var v = {
        code : '<pre><code>{#code#}</code></pre>',
        theme:[
            '<div>',
                '<h1>{#title#}</h1>',
                '{#content#}',
            '</div>'
        ].join("")
    };
    if(Object.prototype.toString.call(name) === "[object Array]"){
        var tpl = '';
        for(var i=0,len=name.length;i<len;i++){
            tpl += arguments.callee(name[i]);
        }
        return tpl;
    }else{
        return v[name] ? v[name] : ('<'+name+'>{#'+name+'#}</'+name+'>');
    }
}