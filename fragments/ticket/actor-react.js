import React from 'react';
import PropTypes from 'prop-types';

export class Provider extends React.Component {
    constructor(props,context) {
        super(props,context);
        const {system,stores} = this.props;
        this.stores = [];
        for(const Store of stores) {
            const actorins = system.actorOf(Store);
            this.stores.push(actorins.getInstance());
        }
    }
    getChildContext() {
        return {
            system: this.props.system,
            stores: this.stores,
        };
    }
    componentWillUnmount() {
        this.stores.forEach(store => store.context.stop());
    }
    render() {
        return React.Children.only(this.props.children);
    }
}
Provider.childContextTypes = {
    system: PropTypes.object,
    stores: PropTypes.array,
};
export const Connect = (stores,selector,initStateFn) => WrapperComponent => class ConnectComponent extends React.Component {
        static contextTypes = {
            system: PropTypes.object,
            stores: PropTypes.array,
        }
        constructor(props,context) {
            super(props,context);
            this.state = {
                system: context.system,
            };
            this.storeIns = [];
            this.subscriptions = [];
            this.getStateFromStores(context,stores,[]);
            if(initStateFn) {
                this.state = {
                    ...this.state,
                    ...initStateFn(this.props),
                };
            }
        }
        componentDidMount() {
            //挂载+监听
            // this.context.system.
            this.storeIns.forEach((store) => {
                const subscription = store.subscribe((state) => {
                    if (selector) {
                        const arrState = this.storeIns.map(storeins => storeins.state);
                        const selectedState = selector(...arrState);
                        if (!shallowEqual(this.state, selectedState)) {
                            this.setState(selectedState);
                        }
                    }else if (!shallowEqual(this.state, state)) {
                        this.setState(state);
                    }
                });
                this.subscriptions.push(subscription);
            });
        }
        shouldComponentUpdate(nextProps,nextState) {
            if(shallowEqual(this.state,nextState) && shallowEqual(this.props,nextProps)) {
                return false;
            }
            return true;
        }
        componentWillUnmount() {
            //stop
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        }
        render() {
            const props = Object.assign({}, this.props, this.state);
            setTimeout(() => {
                console.log(WrapperComponent.name || WrapperComponent.displayName,props);
            },0);
            return React.createElement(WrapperComponent, props);
        }
        getStateFromStores(context,stores,stateArr) {
            stores.forEach((storeitem) => {
                const storeins = context.system.get(storeitem).getInstance();
                if(storeins) {
                    stateArr.push(storeins.state);
                    this.storeIns.push(storeins);
                }else{
                    throw new Error('has no actorof to system');
                }
            });
            Object.assign(this.state, selector ? selector(...stateArr) : stateArr.reduce((acc, state) => ({ ...acc, ...state }), {}));
        }
};
//临时状态 !! ?? 动态挂载
export const Inject = (StoreClass,selector) => WrapperComponent => class InjectComponent extends React.Component {
    static contextTypes = {
        system: PropTypes.object,
        stores: PropTypes.array,
    }
    constructor(props,context) {
        super(props,context);
        this.Store = StoreClass;
        this.subscription = null;
        this.actor = this.context.system.actorOf(this.Store);
        this.store = this.actor.getInstance();
        this.state = {
            system: context.system,
            ...(selector ? selector(this.store.state) : this.store.state),
            dispatch: this.actor.tell.bind(this.actor)
        };
    }
    componentDidMount() {
        this.subscription = this.store.subscribe((state) => {
            if(selector) {
                const selectedState = selector(state);
                if(!shallowEqual(selectedState,this.state)) {
                    this.setState(selectedState);
                }
            }else if (!shallowEqual(this.state, state)) {
                this.setState(state);
            }
        });
    }
    componentWillUnmount() {
        this.subscription && this.subscription.unsubscribe();
        this.actor.getContext().stop();
    }
    render() {
        const props = Object.assign({}, this.props, this.state);
        return (
            <WrapperComponent {...props} />
        );
    }
};
function is(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
}
function shallowEqual(objA,objB) {
    if(is(objA,objB)) {
        return true;
    }
    if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    for (let i = 0; i < keysB.length; i++) {
        const curkey = keysB[i];
        if (!(keysA.indexOf(curkey) > -1) || !is(objA[curkey], objB[curkey])) {
            return false;
        }
    }
    return true;
}
