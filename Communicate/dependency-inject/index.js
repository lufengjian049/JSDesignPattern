//dependency inject
const globalState = {
  injectSymbol: Symbol('injectsymbol'),
  instances: new WeakMap(),
};
function inject(injectclass) {
  return (target,key,descriptor) => {
    // if(descriptor) {
    //   descriptor.enumerable = true;
    //   descriptor.configureable = true;
    //   descriptor.writeable = true;
    // }
    if(!target[globalState.injectSymbol]) {
      Object.defineProperty(target,globalState.injectSymbol,{
        enumerable: true,
        configurable: true,
        value: new Map()
      })
    }
    target[globalState.injectSymbol][key] = injectclass;
  }
}
class Container {
  get(classfun) {
    if(!globalState.instances.has(classfun)) {
      throw new Error('还未注册过，set进行注册');
    }
    const instance = globalState.instances.get(classfun);
    if(!instance[globalState.injectSymbol]) {
      return instance;
    }
    for(let [key,injectclass] of instance[globalState.injectSymbol]) {
      Object.defineProperty(instance,key,{
        get() {
          return globalState.instances.get(injectclass)
        },
        set(newValue) {
          instance[key] = newValue;
        }
      })
    }
    return instance;
  }
  set(classfun,instance) {
    if(!globalState.instances.has(classfun)) {
      globalState.instances.set(classfun,instance);
    }
  }
}

//compute
class State {
  num = 0
}
//依赖注入
//保存依赖的映射关系，属性key => State
class Action {
  @inject(State)
  state

  setnum(num) {
    this.state.num = num;
  }
}
var container = new Container();
container.set(Action,new Action());
container.set(State,new State());

var action  = container.get(Action);
var state = container.get(State);
action.setnum(2);
console.log(state.num);