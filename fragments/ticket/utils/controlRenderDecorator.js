/**
 * 控制渲染
 * lufj@ctrip.com
 * @providesModule controlRenderDecorator
 */
import React, { Component } from 'react';
import {DeviceEventEmitter} from 'react-native';

const controlRenderDecorator = eventname => WrapperComponent => class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    shouldComponentUpdate(nextProps,nextState) {
        if(nextState.show !== this.state.show || this.props.timestamp !== nextProps.timestamp) {
            return true;
        }
        return false;
    }
    componentDidMount() {
        this.controller = DeviceEventEmitter.once(eventname,() => {
            this.setState({
                show: true
            });
        });
    }
    componentWillUnmount() {
        this.controller.remove();
    }
    render() {
        if(this.state.show) {
            return (
                <WrapperComponent {...this.props} />
            );
        }
        return null;
    }
};
export default controlRenderDecorator;
