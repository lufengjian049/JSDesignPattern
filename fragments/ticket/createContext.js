/**
 * Detail Context
 * lufj@ctrip.com
 */
/**
 * 运用render props抽象state
 * 支持动态注入
 * createContext(initState)中initState为初始context
 * Provider供给者 value提供context，没有则使用createContext(initState)的initState;
 * Consumer消费者 采用render props方式获取context
 * 可以无缝接入React的new Context api相同!!!(react new Context只在16.x才提供)
 * 注：initState不支持非引用类型，因context中附加了其他的一些功能.
 * 未避免再次出现类似回调地狱问题，后续会提供compose方法
 */
import React from 'react';

function remove(arr,target) {
    const index = arr.indexOf(target);
    if(index >= 0) {
        arr.splice(index,1);
    }
}
class Emitter {
    listeners = []
    subscribe(sub) {
        this.listeners.push(sub);
        return () => remove(this.listeners,sub);
    }
    emit(input) {
        this.listeners.slice().forEach(listen => listen(input));
    }
}
const ContextMap = new Map();
export default function createContext(namespace,initState = {}) {
    if(!namespace || (namespace && typeof namespace !== 'string')) {
        console.warn('namespace is required!!!');
        throw new Error('createContext namespace is required!!');
        // return null;
    }
    const emitter = new Emitter();
    let newState = null;
    let timer = null;
    let callbacks = [];
    let ctx = {
        ...initState,
        ...{
            setState(partialState,callback) {
                callbacks.push(callback);
                const curState = newState || ctx.state;
                if(typeof partialState === 'function') {
                    partialState = partialState(curState);
                }
                newState = {
                    ...curState,
                    ...partialState
                };
                clearTimeout(timer);
                timer = setTimeout(() => {
                    timer = null;
                    ctx.state = newState;
                    newState = null;
                    callbacks.forEach(it => it());
                    callbacks = [];
                    emitter.emit();
                },0);
            },
            setStateSync(partialState) {
                ctx.state = {
                    ...ctx.state,
                    partialState
                };
                emitter.emit();
            }
        }
    };
    const contextMethods = {
        Provider: ({value,children}) => {
            value && (ctx = {...ctx,...value});
            return children;
        },
        Consumer: class extends React.Component {
          static getContext = () => ctx
          static hoc= name => BaseComponent => class extends React.Component {
              componentDidMount() {
                  this.hocUnSubscribe = emitter.subscribe(this.__hocupdate__);
              }
              componentWillUnmount() {
                  this.hocUnSubscribe && this.hocUnSubscribe();
              }
              render() {
                  return React.createElement(BaseComponent,{...this.props,[name]: ctx});
              }
              __hocupdate__ = () => this.forceUpdate()
          }
          componentDidMount() {
              this.unsubscribe = emitter.subscribe(this.__update__);
          }
          componentWillUnmount() {
              this.unsubscribe && this.unsubscribe();
          }
          render() {
              return this.props.children(ctx);
          }
          __update__ = () => this.forceUpdate()
        }
    };
    ContextMap.set(namespace,contextMethods);
    return contextMethods;
}

//提供便捷获取Consumer的方式
//提供两种使用方式：render props 和 hoc
export function withContext(name,Component) {
    return function ContextComponent(props) {
        if(ContextMap.has(name)) {
            const ContextConsumerComponent = ContextMap.get(name).Consumer;
            return (
                <ContextConsumerComponent>
                    {
                        ctx => (Component ? <Component {...ctx} {...props} /> : props.children(ctx))
                    }
                </ContextConsumerComponent>
            );
        }
        throw new Error(`namespace:${name} has no Context Provider or Consumer`);
    };
}
//为避免类回调地狱问题，提供compose方法
export function ContextCompose({contexts,children}) {
    if(typeof children === 'function') {
        //compose Consumer 将各Consumer的值按顺序组合起来
        const allContextValues = [];
        const composeConsumer = (currentContexts) => {
            const ContextConsumer = currentContexts.shift();
            return (
                <ContextConsumer>
                    {
                        (prevContextValue) => {
                            allContextValues.push(prevContextValue);
                            return currentContexts.length ? composeConsumer(currentContexts) : children(...allContextValues);
                        }
                    }
                </ContextConsumer>
            );
        };
        return composeConsumer(contexts);
    }
    //compose Provider
    return contexts.reduceRight((child,context) => React.cloneElement(context,{
        children: child
    }),children);
}
