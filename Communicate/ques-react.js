//component类
//1.文本的渲染，更新等...
function ReactDomTextComponent(text){
  this._currentElement = text + ''
  //标识当前component
  this._rootNodeId = null
}
//component的渲染方法
ReactDomTextComponent.prototype.mountComponent = function(rootid){
  this._rootNodeId = rootid
  return `<span data-reactid="${rootid}">${this._currentElement}</span>`
}
//更新方法
ReactDomTextComponent.prototype.receiveComponent = function(nextText){
  var nextStringText = nextText + ''
  if(nextStringText != this._currentElement){
    this._currentElement = nextStringText
    $('[data-reactid="' + this._rootNodeId + '"]').html(nextStringText);
  }
}
//引入element,react中引入了virtual dom;创建element，都是通过React.createElement来创建ReactElement基本类型
//2.标准dom类型
function ReactDomComponent(element){
  this._currentElement = element
  this._rootNodeId = null
}
ReactDomComponent.prototype.mountComponent = function(rootid){
  this._rootNodeId = rootid
  var element = this._currentElement,props = element.props,
      propsStr = '';
  //有特殊属性，事件需要处理
  for(var propkey in props){
    //处理事件属性，代理下
    if(/^on[A-Za-z]/.test(propkey)){
      var eventType = propkey.replace('on','')
      $(document).delegate('[data-reactid="' + this._rootNodeId + '"]', eventType + '.' + this._rootNodeId, props[propkey]);
    }
    if(props[propkey] && propkey != 'children' && !/^on[A-Za-z]/.test(propkey)){
      propsStr += `${propkey}=${props[propkey]} `
    }
  }
  //递归处理 子节点元素
  var content = '',children = props.children || [],
      childrenInstances = [];
  var self = this
  $.each(children,function(index,child){
    var childInstance = instantiateReactComponent(child)
    childInstance._mountIndex = index
    var childMarkup = childInstance.mountComponent(self._rootNodeId + '.' + index)
    childrenInstances.push(childInstance)
    content += ' ' + childMarkup
  })
  //保存下渲染的所有子节点实例
  this._renderedChildren = childrenInstances
  return `<${element.type} data-reactid="${rootid}" ${propsStr}>
            ${content}
          </${element.type}>`
}
ReactDomComponent.prototype.receiveComponent = function(nextElement){
  var lastProps = this._currentElement.props
  var nextProps = nextElement.props
  this._currentElement = nextElement
  //单独更新属性
  this._updateDOMProperties(lastProps,nextProps)
  //更新子节点
  this._updateDOMChildren(nextElement.props.children)
}
ReactDomComponent.prototype._updateDOMProperties = function(lastProps,nextProps){
  var propKey;
  //老属性在新属性中没有的要删除
  for(propKey in lastProps){
    if(nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey))
      continue
    //有就都跳过了，所以遇到事件要取消
    if (/^on[A-Za-z]/.test(propKey)) {
      var eventType = propKey.replace('on', '');
      $(document).undelegate('[data-reactid="' + this._rootNodeId + '"]', eventType, lastProps[propKey]);
      continue;
    }
    $('[data-reactid="' + this._rootNodeId + '"]').removeAttr(propKey)
  }
  //重新设置一下属性
  for(propKey in nextProps){
    if (/^on[A-Za-z]/.test(propKey)) {
      var eventType = propKey.replace('on', '');
      //以前如果已经有，说明有了监听，需要先去掉
      lastProps[propKey] && $(document).undelegate('[data-reactid="' + this._rootNodeId + '"]', eventType, lastProps[propKey]);
      $(document).delegate('[data-reactid="' + this._rootNodeId + '"]', eventType + '.' + this._rootNodeId, nextProps[propKey]);
      continue;
    }
    if (propKey == 'children') continue;
    $('[data-reactid="' + this._rootNodeId + '"]').prop(propKey, nextProps[propKey])
  }
}
//全局的更新深度标识
var updateDepth = 0;
//全局的更新队列，所有的差异都存在这里
var diffQueue = [];
//更新子节点：1.递归分析差异，将差异放进队列中2.在合适的时机，将差异应用到dom上
ReactDomComponent.prototype._updateDOMChildren = function(nextChildrenElements){
  updateDepth++
  //_diff用来递归找出差别,组装差异对象,添加到更新队列diffQueue。
  this._diff(diffQueue,nextChildrenElements);
  updateDepth--
  if(updateDepth == 0){
      //在需要的时候调用patch，执行具体的dom操作
      this._patch(diffQueue);
      diffQueue = [];
  }
}

//差异更新的几种类型
var UPATE_TYPES = {
    MOVE_EXISTING: 1,
    REMOVE_NODE: 2,
    INSERT_MARKUP: 3
}
//将component类实例，map下；
function flattenChildren(componentChildren) {
    var child;
    var name;
    var childrenMap = {};
    for (var i = 0; i < componentChildren.length; i++) {
        child = componentChildren[i];
        name = child && child._currentElement && child._currentElement.key ? child._currentElement.key : i.toString(36);
        childrenMap[name] = child;
    }
    return childrenMap;
}
//prevChildre为map过的原子节点component实例，返回新的子节点的component实例
function generateComponentChildren(prevChildren, nextChildrenElements) {
    var nextChildren = {};
    nextChildrenElements = nextChildrenElements || [];
    $.each(nextChildrenElements, function(index, element) {
        var name = element.key ? element.key : index;
        var prevChild = prevChildren && prevChildren[name];
        var prevElement = prevChild && prevChild._currentElement;
        var nextElement = element;

        if (_shouldUpdateReactComponent(prevElement, nextElement)) {
            //子节点元素的component实例去更新 新的element
            prevChild.receiveComponent(nextElement);
            //然后继续使用老的component
            nextChildren[name] = prevChild;
        } else {
            //新的元素，重新生成一个component实例
            var nextChildInstance = instantiateReactComponent(nextElement, null);
            nextChildren[name] = nextChildInstance;
        }
    })
    return nextChildren;
}
//_diff用来递归找出差别,组装差异对象,添加到更新队列diffQueue。
ReactDomComponent.prototype._diff = function(diffQueue, nextChildrenElements) {
  var self = this;
  //原component类实例数组
  var prevChildren = flattenChildren(self._renderedChildren);
  //生成新的子节点的component对象集合，这里注意，会复用老的component对象
  var nextChildren = generateComponentChildren(prevChildren, nextChildrenElements);
  //重新赋值_renderedChildren，使用最新的。
  self._renderedChildren = []
  $.each(nextChildren, function(key, instance) {
    self._renderedChildren.push(instance);
  })
  var lastIndex = 0;
  var nextIndex = 0; //代表到达的新的节点的index
  //通过对比两个集合的差异，组装差异节点添加到队列中
  for (name in nextChildren) {
    if (!nextChildren.hasOwnProperty(name)) {
      continue;
    }
    var prevChild = prevChildren && prevChildren[name];
    var nextChild = nextChildren[name];
    //相同的话，说明是使用的同一个component,所以我们需要做移动的操作
    if (prevChild === nextChild) {
      //添加差异对象，类型：MOVE_EXISTING
      prevChild._mountIndex < lastIndex && diffQueue.push({
        parentId: self._rootNodeId,
        parentNode: $(`[data-reactid="${self._rootNodeId}"]`),
        type: UPATE_TYPES.MOVE_EXISTING,
        fromIndex: prevChild._mountIndex,
        toIndex: nextIndex
      })
    } else { //如果不相同，说明是新增加的节点
      //但是如果老的还存在，就是element不同，但是component一样。我们需要把它对应的老的element删除。
      if (prevChild) {
        diffQueue.push({
          parentId: self._rootNodeId,
          parentNode: $(`[data-reactid="${self._rootNodeId}"]`),
          type: UPATE_TYPES.REMOVE_NODE,
          fromIndex: prevChild._mountIndex,
          toIndex: null
        })
        if (prevChild._rootNodeId) {
            $(document).undelegate('.' + prevChild._rootNodeId);
        }
        lastIndex = Math.max(prevChild._mountIndex, lastIndex)
      }
      //新增加的节点，也组装差异对象放到队列里
      diffQueue.push({
        parentId: self._rootNodeId,
        parentNode: $(`[data-reactid="${self._rootNodeId}"]`),
        type: UPATE_TYPES.INSERT_MARKUP,
        fromIndex: null,
        toIndex: nextIndex,
        markup: nextChild.mountComponent(self._rootNodeId + '.' + nextIndex) //新增的节点，多一个此属性，表示新节点的dom内容
      })
    }
    //更新mount的index
    nextChild._mountIndex = nextIndex;
    nextIndex++;
  }

  //对于老的节点里有，新的节点里没有的那些，也全都删除掉
  for (name in prevChildren) {
    if (prevChildren.hasOwnProperty(name) && !(nextChildren && nextChildren.hasOwnProperty(name))) {
      //添加差异对象，类型：REMOVE_NODE
      diffQueue.push({
        parentId: self._rootNodeId,
        parentNode: $(`[data-reactid="${self._rootNodeId}"]`),
        type: UPATE_TYPES.REMOVE_NODE,
        fromIndex: prevChild._mountIndex,
        toIndex: null
      })
      //如果以前已经渲染过了，记得先去掉以前所有的事件监听
      if (prevChildren[name]._rootNodeId) {
        $(document).undelegate('.' + prevChildren[name]._rootNodeId);
      }
    }
  }
}
//用于将childNode插入到指定位置
function insertChildAt(parentNode, childNode, index) {
    var beforeChild = parentNode.children().get(index);
    beforeChild ? childNode.insertBefore(beforeChild) : childNode.appendTo(parentNode);
}
ReactDomComponent.prototype._patch = function(updates){
  var update;
  var initialChildren = {};
  var deleteChildren = [];
  for (var i = 0; i < updates.length; i++) {
    update = updates[i];
    if (update.type === UPATE_TYPES.MOVE_EXISTING || update.type === UPATE_TYPES.REMOVE_NODE) {
      var updatedIndex = update.fromIndex;
      var updatedChild = $(update.parentNode.children().get(updatedIndex));
      var parentID = update.parentId;
      initialChildren[parentID] = initialChildren[parentID] || [];
      //使用parentID作为简易命名空间
      initialChildren[parentID][updatedIndex] = updatedChild;
      //需要修改的，先move在append
      deleteChildren.push(updatedChild)
    }
  }
  $.each(deleteChildren, function(index, child) {
    $(child).remove();
  })

  //再遍历一次，这次处理新增的节点，还有修改的节点这里也要重新插入
  for (var k = 0; k < updates.length; k++) {
    update = updates[k];
    switch (update.type) {
      case UPATE_TYPES.INSERT_MARKUP:
        insertChildAt(update.parentNode, $(update.markup), update.toIndex);
        break;
      case UPATE_TYPES.MOVE_EXISTING:
        insertChildAt(update.parentNode, initialChildren[update.parentId][update.fromIndex], update.toIndex);
        break;
      case UPATE_TYPES.REMOVE_NODE:
        // 什么都不需要做，因为上面已经帮忙删除掉了
        break;
    }
  }
}
//3.自定义节点,crateElement接受的是一个 class类，又引入了React.createClass(...)
function ReactCompositeComponent(element){
  this._currentElement = element
  this._rootNodeId = null
  this._currentInstance = null
}
ReactCompositeComponent.prototype.mountComponent = function(rootid){
  this._rootNodeId = rootid
  var props = this._currentElement.props
  var inst = new this._currentElement.type(props) // type里面是当前构造函数,createClass的子类
  this._currentInstance = inst

  //保留对当前component的引用，下面更新会用到
  inst._reactInternalInstance = this;
  
  if(inst.componentWillMount)
    inst.componentWillMount()
  var renderElement = inst.render()
  var renderInst = instantiateReactComponent(renderElement)
  this._renderedComponent = renderInst
  var renderMarkup = renderInst.mountComponent(rootid)
  $(document).on("mountReady",function(){
    inst.componentDidMount && inst.componentDidMount()
  })
  return renderMarkup
}
ReactCompositeComponent.prototype.receiveComponent = function(nextElement,newState){
  this._currentElement = nextElement || this._currentElement
  var inst = this._currentInstance
  //合并state
  var nextState = $.extend(this._currentInstance.state,newState)
  var nextProps = this._currentElement.props
  //改写state ??? 改写了 ？
  inst.state = nextState

  if(inst.shouldComponentUpdate && inst.shouldComponentUpdate(nextProps,nextState) === false)
    return
  if(inst.componentWillUpdate) inst.componentWillUpdate(nextProps,nextState)
  
  //获取原 element
  var prevComponentInstance = this._renderedComponent
  var prevRenderedElement = prevComponentInstance._currentElement
  //重新执行render，获取新的element,重新执行时，因为上面state已经改成了最新...,所以返回的是最新的需要render的元素
  var nextRenderedElement = inst.render()
  //判断是否需要更新 还是直接渲染
  if(_shouldUpdateReactComponent(prevRenderedElement,nextRenderedElement)){
    //如果需要更新，递归调用子节点的receiveComponent方法
    prevComponentInstance.receiveComponent(nextRenderedElement)
    inst.componentDidUpdate && inst.componentDidUpdate()
  }else{
    //如果发现是两种完全不一样的element，直接重新渲染
    var thisId = this._rootNodeId
    //重新new一个对应的component，
    this._renderedComponent = instantiateReactComponent(nextRenderedElement);
    //重新生成对应的元素内容
    var nextMarkup = this._renderedComponent.mountComponent(thisId);
    //替换整个节点
    $('[data-reactid="' + this._rootNodeId + '"]').replaceWith(nextMarkup);
  }
}
function _shouldUpdateReactComponent(prevElement,nextElement){
  if (prevElement != null && nextElement != null) {
    var prevType = typeof prevElement;
    var nextType = typeof nextElement;
    if (prevType === 'string' || prevType === 'number') {
      return nextType === 'string' || nextType === 'number';
    } else {
      return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
    }
  }
  return false;
}

//component工厂类，根据不同的类型，提供不同的component实例；目前有3种类型，纯文本、标准dom、自定义节点
function instantiateReactComponent(node){
  if(typeof node === 'string' || typeof node === 'number'){
    return new ReactDomTextComponent(node)
  }
  //用React.createElement进来的是ReactElement实例
  if(typeof node === 'object' && typeof node.type === 'string'){
    return new ReactDomComponent(node)
  }
  if(typeof node === 'object' && typeof node.type === 'function'){
    return new ReactCompositeComponent(node)
  }
}

//ReactElement就是虚拟dom的概念，type就是标签类型，key是标签的唯一标识，作更新用，props就是标签的属性
function ReactElement(type,key,props){
  this.type = type
  this.key = key
  this.props = props
}
//超级父类
function ReactClass(){}
ReactClass.prototype.render = function(){}
ReactClass.prototype.setState = function(newState){
  this._reactInternalInstance.receiveComponent(null,newState)
}
var React = {
  nextReactRootId: 0,
  //render的都是通过createElement出来的虚拟元素，除文本以外！！！只是type是有区别，type：标准dom元素；createClass出来的组件子类元素
  createElement:function(type,config,children){
    //简易版
    var props = {},propName;
    config = config || {}
    var key = config.key || null
    //将config复制到props中
    for(propName in config){
      if(config.hasOwnProperty(propName) && propName != key){
        props[propName] = config[propName]
      }
    }
    var childrenArr = [].slice.call(arguments,2)
    if(childrenArr.length == 1){
      props.children = $.isArray(children) ? children : [children]
    }else if(childrenArr.length > 1){
      props.children = childrenArr
    }
    //最终返回的是ReactElement的实例对象，也就是虚拟元素的实例
    return new ReactElement(type,key,props)
  },
  //有生命周期
  createClass:function(spec){
    //子类
    function Constructor(props){
      this.props = props
      this.state = this.getInitialState ? this.getInitialState() : null
    }
    Constructor.prototype = new ReactClass()
    Constructor.prototype.constructor = Constructor
    $.extend(Constructor.prototype,spec)
    return Constructor
  },
  render:function(element,container){
    var componentInstance = instantiateReactComponent(element)
    var markup = componentInstance.mountComponent(this.nextReactRootId++)
    $(container).html(markup)
    //触发完成的mount事件
    $(document).trigger('mountReady')
  }
}
//component工厂，根据要渲染的元素类型生成出对应的component实例
//调用component实例的mountComponent方法获取到要渲染的dom元素
//render方法在渲染到页面中