/**
 * Drag View
 * lufj@ctrip.com
 * @providesModule DragableView
 */
import React from 'react';
import {Animated,PanResponder} from 'react-native';

export default class DragableView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pan: new Animated.ValueXY(),
            allowDrag: true,
        };
        const dragheight = this.props.dragHeight || 150;
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => this.props.canDrag && this.state.allowDrag && gestureState.dy > 0.24,
            onPanResponderMove: (evt,gestureState) => {
                this.props.changePosition && this.props.changePosition(gestureState.dy);
                this.state.pan.y.setValue(Math.max(gestureState.dy,0));
            },
            onPanResponderRelease: (evt,gestureState) => {
                this.props.changePosition && this.props.changePosition(0);
                if(gestureState.dy > dragheight) {
                    this.closeAction(() => {
                        this.state.pan.setValue({x: 0, y: 0});
                    });
                }else{
                    Animated.timing(
                        this.state.pan,
                        {toValue: {x: 0,y: 0}}
                    ).start();
                }
            },
            onPanResponderTerminationRequest: () => false
        });
        this.changeDragState = this.changeDragState.bind(this);
        this.closeAction = this.closeAction.bind(this);
    }
    render() {
        return (
            <Animated.View
                {...this.panResponder.panHandlers}
                style={[this.props.style,{
                    transform: [{
                        translateY: this.state.pan.y
                    }]
                }]}
            >
                {
                    this.props.children({
                        changeDragState: this.changeDragState
                    })
                }
            </Animated.View>
        );
    }
    changeDragState(drag = true) {
        this.setState({
            allowDrag: drag
        });
    }
    closeAction(fn) {
        this.props.closeAction && this.props.closeAction(fn);
    }
}
DragableView.defaultProps = {
    closeAction: null,
    canDrag: true
};
