function queueFunc(queue){
  if(Object.prototype.toString.call(queue) == '[object Array]'){
    this.data = queue;
  }else{
    this.data = [queue];
  }
  this.head = 1;
  this.tail = this.data.length + 1;
}
queueFunc.prototype.enqueue = function(val){
  this.data[this.tail++] = val;
}
queueFunc.prototype.dequeue = function(){
  return this.data[this.head++];
}
// queueFunc.prototype.get = function(){
//   return this.data[this.head];
// }
queueFunc.prototype.isEmpty = function(){
  return this.head == this.tail;
}
//递归--深度优先遍历
function getElementByid(elem,id){
  if(!elem) return null;
  if(elem.id == id)
    return elem;
  for(var i=0;i<elem.childNodes.length;i++){
    var found = getElementByid(elem.childNodes[i],id)
    if(found)
      return found;
  }
  return null;
}
//广度优先
function getElementByidWFS(elem){
  var queue1 = new queueFunc(elem);
  return function(id){
    while(queue1.head < queue1.tail){
      //先check  还是先找扩展
      var elem = queue1.dequeue();
      if(elem.id == id){
        return;
      }
      for(var i=0;i<elem.childNodes.length;i++){
        var curElem = elem.childNodes[i];
        queue1.enqueue(curElem);
      }
    }
  }
}
getElementByidWFS("")("id");
//非递归-深度优先遍历
function getElementByid2(elem,id){
  while(elem){
    if(elem.id == id)
      return elem;
    elem = nextElement(elem);
  }
  return null;
}
function nextElement(elem){
  if(elem.childNodes.length){
    return elem.childNodes[0];
  }
  if(elem.nextElementSibling){
    return elem.nextElementSibling;
  }
  var parentNode = elem.parentNode;
  while(parentNode){
    if(parentNode.nextElementSibling){
      return parentNode.nextElementSibling;
    }
    parentNode = parentNode.parentNode;
  }
}
//实际浏览器是用一个hash-map存储id与dom节点的映射关系，通过id直接找到dom节点

function match(node,selector){
  if(node == document)
    return false;
  switch(selector.matchType){
    case 'class':
      return !!~node.className.trim().indexOf(selector.value);
    case 'tag':
      return node.tagName.toLowerCase() == selector.value.toLowerCase();
    default:
      throw 'unknow selector type'
  }
}
function nextTarget(node,selector){
  if(node == document)
    return null;
  switch(selector.relation){
    case "descendant": //祖孙
        return {node: node.parentNode, hasNext: true};
    case "child": //父子
        return {node: node.parentNode, hasNext: false};
    case "sibling":
        return {node: node.previousSibling, hasNext: true};
    default:
        throw "unknown selector relation type";
  }
}
function querySelector(node,selectors){
  while(node){
    var currentnode = node;
    if(!match(node,selectors[0])){
      node = nextElement(currentnode);
      continue;
    }
    var next = null,matchIt;
    for(var i=0;i<selectors.length-1;i++){
      matchIt = false;
      do{
        next = nextTarget(node,selectors[i]);
        node = next.node;
        if(!node) break;
        if(match(node,selectors[i+1])){
          matchIt = true;
          break;
        }
      }while(next.hasNext);
      if(!matchIt) break;
    }
    if(matchIt && i == selectors.length -1){
      return currentnode;
    }
    node = nextElement(currentnode);
  }
  return null;
}
//querySelector(".info>div .content"); //subSelector
//将selector序列化为以下格式

function getSealizeSelectors(selectors){
  if(selectors){
    //未捕获分组 ?:
    var reg = /((?:\s*>\s*)|(?:\s*\+\s*)| +)?(\.|#)?(\w+)/g;
    var sealizeArr = [];
    var matcharr = [];
    while(matcharr){
      matcharr = reg.exec(selectors)
      if(matcharr && matcharr.length){
        var sealizeobj = {};
        sealizeobj.matchType = getMatchType(matcharr[2]);
        sealizeobj.value = matcharr[3];
        sealizeobj.relation = getRelation(matcharr[1]);
        sealizeArr.unshift(sealizeobj);
      }
    }
    console.log(sealizeArr);
  }
}
function getMatchType(matchstr){
  switch(matchstr){
    case '.':
      return 'class';
    case '#':
      return 'id';
    default:
      return 'tag';
  }
}
function getRelation(relastr){
  if(relastr == void 0){
    return 'subSelector';
  }
  relastr = relastr && relastr.trim();
  switch(true){
    case relastr == ">":
      return 'child';
    case relastr == "+":
      return 'sibling';
    default:
      return 'descendant';
  }
}
getSealizeSelectors(".info> div+p  .content");
//空格问题
// [ { matchType: 'class', value: 'content', relation: 'descendant' },
// { matchType: 'tag', value: 'div', relation: 'child' },
// { matchType: 'class', value: 'info', relation: 'subSelector' } ]

// [ { matchType: 'class', value: 'content', relation: 'descendant' },
// { matchType: 'tag', value: 'p', relation: 'sibling' },
// { matchType: 'tag', value: 'div', relation: 'child' },
// { matchType: 'class', value: 'info', relation: 'subSelector' } ]

//https://juejin.im/post/5958bac35188250d892f5c91
