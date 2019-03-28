/**
 * Slider类型的PopLayer通用组件
 * lufj@ctrip.com
 */
import React from 'react';
// import PropTypes from 'prop-types';
import {
    View,
    Modal as NativeModal,
    StyleSheet,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Image,
    Dimensions,
    Platform,
    PanResponder,
    Text,
    Animated,
} from 'react-native';
import {Toast,Device} from '@ctrip/crn';
import {AnimateView} from '../animation';
import {AbsoluteView,FlexView} from './Layout';
// import {pagePopGestureConfig} from '../../../pages';
import Label from './Label';
import DragableView from './DragableView';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
export const dragfix = Math.floor(deviceHeight / 5);
export default class SliderPopLayer extends React.Component {
    // propTypes = {
    //     contentHeight: PropTypes.number,//内容高度的比例，默认为84%
    //     headertitle: PropTypes.style,
    //     show: PropTypes.bool,
    //     loading: PropTypes.bool,
    //     contentinfo: PropTypes.object,
    //     footer: PropTypes.element,
    //     page: //如果传了当前的page，会做page的 drag控制
    // }
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
        };
        this._closeAction = this._closeAction.bind(this);
        this.footerClose = this.footerClose.bind(this);
        this.multiNextPage = this.multiNextPage.bind(this);
        this._multiPrevPage = this._multiPrevPage.bind(this);
        this._multiNextPage = this._multiNextPage.bind(this);
        this.closeAction = this.closeAction.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.show !== nextProps.show) {
            this.setModalVisible(nextProps.show,() => {
                if(nextProps.show) {
                    this.backdropRef && this.backdropRef.transitionTo({
                        stylename: 'opacity',
                        fromValue: 0,
                        toValue: 0.7
                    });
                    this.aniView && this.aniView.slideInUp(null,150);
                    this.imgloadref && this.imgloadref.showloading();
                    this.pagedrag(false);
                    this.props.showCallback && this.props.showCallback();
                }else{
                    this.props.hideCallback && this.props.hideCallback();
                }
            });
        }
        if(nextProps.error && nextProps.error !== this.props.error) {
            Toast.show(nextProps.error);
        }
    }
    pagedrag(open = true) {
        this.props.pageDrag(open);
        // if (open) {
        //     this.props.pageConfig.sceneConfig.gestures.pop = pagePopGestureConfig;
        //     // Bridge.callNative('Page', 'enableNativeDragBack', null);
        // } else {
        //     this.props.pageConfig.sceneConfig.gestures.pop = null;
        //     Bridge.callNative('Page', 'disableNativeDragBack', null);
        // }
    }
    setModalVisible(visible,callback) {
        this.setState({show: visible},() => {
            setTimeout(() => {
                callback && typeof callback === 'function' && callback();
            },Device.isiPhoneX ? 200 : 0);
        });
    }
    _closeAction(hideBeforeFn,hideAfterFn) {
        this.backdropRef.transitionTo({
            stylename: 'opacity',
            fromValue: 0.7,
            toValue: 0
        },null,200);
        this.aniView.slideOutDown(() => {
            this.aniView.setNativeProps({
                opacity: 0
            });
            this.backdropRef.setNativeProps({
                opacity: 0
            });
            hideBeforeFn && typeof hideBeforeFn === 'function' && hideBeforeFn();
            this.props.hide();
            this.pagedrag();
            hideAfterFn && typeof hideAfterFn === 'function' && hideAfterFn();
        },200);
    }
    multiNextPage(options) {
        this.nextviewpage.renderPage(options,this._multiNextPage);
    }
    _multiPrevPage() {
        this.viewpage && this.viewpage.slideInLeft();
    }
    _multiNextPage() {
        this.viewpage && this.viewpage.slideOutLeft();
    }
    footerClose(methodname,...rest) {
        this.props.hide();
        this.pagedrag();
        setTimeout(() => {
            this.props.action[methodname](...rest);
        },Device.isiPhoneX ? 200 : 0);
    }
    closeAction(hideBeforeFn,hideAfterFn) {
        this._closeAction(hideBeforeFn,hideAfterFn);
        this.props.headerCallback && this.props.headerCallback();
    }
    render() {
        const aniViewHeight = Math.floor(deviceHeight * this.props.contentHeight);
        const LayerFooter = this.props.footer;
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.show}
                onRequestClose={this._closeAction}
            >
                <AnimateView
                    ref={ref => this.backdropRef = ref}
                    style={styles.backdrop}
                />
                <TouchableWithoutFeedback onPress={this.closeAction}>
                    <View style={{flex: 1}} />
                </TouchableWithoutFeedback>
                <ImageLoad loading={this.props.loading} ref={ref => this.imgloadref = ref} />
                <ModalDragTip dragHeight={dragfix} ref={ref => this.modalDragRef = ref} />
                <AnimateView
                    style={[styles.multipagewrapper,{height: aniViewHeight}]}
                    ref = {ref => this.aniView = ref}
                >
                    <AnimateView ref={ref => this.viewpage = ref} style={styles.multipage}>
                        <View style={[styles.singlepage,{height: aniViewHeight}]}>
                            {
                                !this.props.hideHeader && (
                                    <PopLayerHeader
                                        closeAction={this.closeAction}
                                        title={this.props.headertitle}
                                    />
                                )
                            }
                            <DragableView
                                style={styles.layercontent}
                                canDrag={this.props.canDrag}
                                closeAction={this.closeAction}
                                dragHeight={dragfix}
                                changePosition={(dy) => {
                                    this.modalDragRef && this.modalDragRef.changePosition(dy);
                                }}
                            >
                                {
                                    ({changeDragState}) => (!this.props.loading ? React.cloneElement(this.props.children,{
                                        ...this.props.contentinfo,
                                        nextpage: this.multiNextPage,
                                        closeAction: this.closeAction,
                                        allowDragging: changeDragState
                                    }) : null)
                                }
                            </DragableView>
                            {
                                this.props.footer && !this.props.loading ? <LayerFooter footinfo={this.props.footinfo} closeAction={this.footerClose} />
                                    : null
                            }
                        </View>
                        <View style={[styles.singlepage,{height: aniViewHeight,backgroundColor: '#fff'}]}>
                            <LayerNextPage
                                ref={ref => this.nextviewpage = ref}
                                backAction={this._multiPrevPage}
                                closeAction={this.closeAction}
                            />
                        </View>
                    </AnimateView>
                </AnimateView>
            </Modal>
        );
    }
}
SliderPopLayer.defaultProps = {
    contentHeight: 0.84,
    headertitle: '购买须知',
    show: false,
    loading: true,
};

//防止图片链接失效,
class ImageLoad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: this.props.indicator || false,
            toshow: false
        };
    }
    showloading() {
        this.setState({
            toshow: true
        });
    }
    render() {
        if(!this.props.loading || !this.state.toshow) {
            return null;
        }
        return (
            <View style={styles.imgloadwrapper}>
                {
                    this.state.error ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Image
                            // source={{uri: 'https://pic.c-ctrip.com/VacationH5Pic/taocan/dp2/loading.gif'}}
                            source={require('./imgs/loading.gif')}
                            style={{width: 100,height: 100}}
                            onError={() => {
                                this.setState({error: true});
                            }}
                        />
                    )
                }
            </View>
        );
    }
}
//头部组件
const PopLayerHeader = props => (
    <FlexView style={styles.layerheader} auto={true}>
        {
            props.hasback ? (
                <AbsoluteView onPress={props.backAction} style={[styles.layerheaderbtn,styles.layerheaderleft]}>
                    <Label type="commonicon" size={20} color="#999">&#xe015;</Label>
                </AbsoluteView>
            ) : null
        }
        <FlexView style={styles.layerheadercontent} auto={true}>
            <Label size={18} text={props.title || '购买须知'} />
        </FlexView>
        <AbsoluteView onPress={props.closeAction} style={[styles.layerheaderbtn,styles.layerheaderright]}>
            <Label type="commonicon" size={18} color="#999">&#xe004;</Label>
        </AbsoluteView>
    </FlexView>
);
class LayerNextPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            title: '',
            renderFn: () => {}
        };
    }

    componentWillMount() {
        const {backAction} = this.props;
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt) => {
                const {nativeEvent: {pageX}} = evt;
                return pageX < 50;
            },
            onPanResponderRelease: (evt, gestureState) => {
                const {dx} = gestureState;
                if (dx > Math.floor(deviceWidth / 3)) {
                    typeof backAction === 'function' && backAction();
                }
            },
        });
    }

    shouldComponentUpdate(nextProps,nextState) {
        if(this.state.name === nextState.name) {
            return false;
        }
        return true;
    }
    renderPage(opt,callback) {
        if(opt.name === this.state.name) {
            callback && callback();
            return;
        }
        this.setState({
            ...opt
        },() => {
            callback && callback();
        });
    }
    render() {
        const {title,renderFn,name} = this.state;
        const {backAction,closeAction} = this.props;
        if(!name) {
            return null;
        }
        return (
            <View style={{flex: 1}} {...this._panResponder.panHandlers}>
                <PopLayerHeader title={title} hasback={true} backAction={backAction} closeAction={closeAction} />
                {
                    renderFn ? renderFn() : null
                }
            </View>
        );
    }
}
class Modal extends React.Component {
    render() {
        if(Platform.OS === 'ios') {
            if(this.props.visible) {
                return (
                    <View style={{position: 'absolute',width: deviceWidth,height: deviceHeight}}>
                        {
                            this.props.children
                        }
                    </View>
                );
            }
            return null;
        }
        return (
            <NativeModal {...this.props} />
        );
    }
}
//3种状态，默认没有提示，滑动提示 释放提示
class ModalDragTip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            pan: new Animated.ValueXY(),
        };
        this.tip = {
            1: {
                icon: '\ue995',
                tip: '继续下拉关闭浮层'
            },
            2: {
                icon: '\ue6b9',
                tip: '释放关闭浮层'
            }
        };
    }
    changePosition(dy) {
        this.state.pan.y.setValue(Math.max(dy,0));
        this.setState({
            status: dy > (this.props.dragHeight || 150) ? 2 : dy > 0 ? 1 : 0
        });
    }
    render() {
        if(this.state.status > 0) {
            const curtip = this.tip[this.state.status];
            //滑动提示
            return (
                <Animated.View style={[styles.dragtip,{
                    transform: [{
                        translateY: this.state.pan.y
                    }]
                }]}
                >
                    <Label type="ttdicon" style={styles.dragtiptext}>{curtip.icon}</Label>
                    <Text style={styles.dragtiptext}>{curtip.tip}</Text>
                </Animated.View>
            );
        }
        return null;
    }
}
export {ImageLoad,ModalDragTip};

const styles = StyleSheet.create({
    imgloadwrapper: {
        position: 'absolute',width: deviceWidth,height: deviceHeight,justifyContent: 'center',alignItems: 'center',zIndex: 100
    },
    backdrop: {
        opacity: 0,
        backgroundColor: 'rgba(0,0,0,1)',
        width: deviceWidth,
        height: deviceHeight,
        position: 'absolute',
    },
    multipagewrapper: {
        zIndex: 10,
        width: deviceWidth,
        // backgroundColor: '#fff',
        transform: [{ translateY: -deviceHeight }]
    },
    closeBtn: {
        alignItems: 'flex-end',
        marginRight: 30, // todo:iphonex + ??
        marginTop: 20,
    },
    closeBtnText: {
        color: '#fff',
        fontSize: 16,
        width: 100,
        height: 30,
        textAlign: 'center',
    },
    multipage: {
        width: deviceWidth * 2,
        flexDirection: 'row',
    },
    singlepage: {
        width: deviceWidth
    },
    layerheader: {
        height: 40,
        backgroundColor: '#efefef',
    },
    layerheaderbtn: {
        top: 0,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
    },
    layerheaderleft: {
        left: 0,
    },
    layerheaderright: {
        right: 0,
    },
    layerheadercontent: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    layercontent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dragtip: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: 10
    },
    dragtiptext: {
        color: '#fff',
        marginRight: 2
    }
});
