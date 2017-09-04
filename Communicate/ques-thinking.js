var specialTags = "script,noscript,style";

function makeUp(tags){
  var map = tags.split(",").reduce(function(buf,value){
    buf[value] = true;
    return buf;
  },Object.create(null));
  return function(tagname){
    return !!map[tagname]
  };
}

var isSpecialTag = makeUp(specialTags);
console.log(isSpecialTag("script"));
console.log(isSpecialTag("div"));

//需求改变，忽略大小写

var lowerParam = function(fn){
  return function(param){
    return fn((param || "").toLowerCase());
  };
};

var isSpecialTag2 = lowerParam(makeUp(specialTags));
console.log(isSpecialTag2("Script"));
console.log(isSpecialTag2("SCRIPT"));