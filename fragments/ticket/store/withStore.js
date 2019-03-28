/**
 * 绑定store，
 */

import React from 'react';
import store from './index';

const withStore = (subscribekey,mapActionToProps) => WrapperComponent => {
    class WithStore extends React.Component {
        constructor(props) {
            super(props);
            // console.log(store.getState()[subscribekey]);
            this.state = {
                ...mapActionToProps(store.dispatch.bind(store)),
                timestamp: 0,
                ...store.getState()[subscribekey],
            };
        }
        // updateComonent(gstate,isinit) {
        //     const curstate = connectkeys.reduce((stateobj,key) => {
        //         if(gstate[key]) {
        //             stateobj[key] = gstate[key];
        //         }
        //         return stateobj;
        //     },{});
        //     if(isinit) {
        //         this.state = {
        //             ...this.state,
        //             ...curstate,
        //         };
        //     }else{
        //         this.setState(curstate);
        //     }
        // }
        componentDidMount() {
            store.subscribe((action,state) => {
                if(state[subscribekey].timestamp !== this.state.timestamp) {
                    this.setState({
                        ...state[subscribekey]
                    });
                }
            });
        }
        render() {
            return (
                <WrapperComponent {...this.props} {...this.state} />
            );
        }
    }
    WithStore.displayName = `WithStore${getDisplayName(WrapperComponent)}`;
    return WithStore;
};
function getDisplayName(WrapperComponent) {
    return WrapperComponent.displayName || WrapperComponent.name || 'HOComponent';
}
export default withStore;
