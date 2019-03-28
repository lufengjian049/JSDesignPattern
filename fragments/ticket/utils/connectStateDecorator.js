/**
 * lufj@ctrip.com
 * 绑定到对应的state数据，并负责更新当前组件
 * @providesModule connectStateDecorator
 */
import React, { Component } from 'react';
import storeShape from 'storeShape';
// import {InteractionManager} from 'react-native';

const connectStateDecorator = statekey => WrapperComponent => class extends WrapperComponent {
    static displayName = `${statekey}Compoennt`
    static contextTypes = {
        store: storeShape
    };

    constructor(props, context) {
        super(props);
        this.store = props.store || context.store;
        const rootstate = this.store.getState();
        const {dispatch,...otherprops} = this.props;
        this.state = {
            ...rootstate[statekey],
            ...otherprops,
        };
    }

    componentDidMount() {
        super.componentDidMount && super.componentDidMount();
        this.unsubscribe = this.store.subscribe(() => {
            const rootstate = this.store.getState();
            if ((this.state.done !== rootstate[statekey].done && rootstate[statekey].done) || (!!rootstate[statekey].timestamp && this.state.timestamp !== rootstate[statekey].timestamp)) {
                // console.log('connectStateDecorator -- setState',statekey,Date.now());
                // InteractionManager.runAfterInteractions(() => {
                this.setState(rootstate[statekey]);
                // });
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // if(this.state.done === nextState.done) {
        //     return false;
        // }
        // return true;
        return super.shouldComponentUpdate ? super.shouldComponentUpdate(nextProps,nextState) : true;
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentDidUpdate() {
        super.componentDidUpdate && super.componentDidUpdate();
        // console.log('connectStateDecorator -- componentDidUpdate',statekey,Date.now());
    }

    render() {
        if (this.state.done) {
            // console.log('connectStateDecorator -- render',statekey,WrapperComponent.displayName,Date.now());
            return super.render();
        }
        return null;
    }
};
export default connectStateDecorator;

export const withStateWrapper = InjectComponent => class extends Component {
    render() {
        return (
            <InjectComponent {...this.state} />
        );
    }
};
