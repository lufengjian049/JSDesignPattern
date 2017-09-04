//Element.match方法返回一个布尔值，表示当前元素是否匹配给定的CSS选择器

function matchesSelector(el, selector) {
  var p = Element.prototype;
  var f = p.matches
    || p.webkitMatchesSelector
    || p.mozMatchesSelector
    || p.msMatchesSelector
    || function(s) {
    return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
  };
  return f.call(el, selector);
}

// 用法
matchesSelector(
  document.getElementById('myDiv'),
  'div.someSelector[some-attribute=true]'
)

// HTML元素的属性名是大小写不敏感的，但是JavaScript对象的属性名是大小写敏感的。转换规则是，转为JavaScript属性名时，一律采用小写。
// 如果属性名包括多个单词，则采用骆驼拼写法，即从第二个单词开始，每个单词的首字母采用大写

//https://nx-framework.com/docs/basics/structure