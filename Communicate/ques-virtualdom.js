//https://github.com/livoras/blog/issues/13
function Element(tagname,props,children){
  this.tagname = tagname
  this.props = props
  this.children = children
}
Element.prototype.render = function(){
  var el = document.createElement(this.tagname)
  var props = this.props
  for(var propName in props){
    el.setAttribute(propName,props[propName])
  }
  var children = this.children || []
  children.forEach(function(child) {
    var childEl = child instanceof Element ? child.render() : document.createTextNode(child)
    el.appendChild(childEl)
  }, this);
  return el
}
function createElement(tagname,props,children){
  return new Element(tagname,props,children)
}
