import React, { Component as NativeComponent } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Image,
    Text,
} from 'react-native';
import {AnimateView} from '../animation';
import {deviceWidth,deviceHeight} from './util';
import {ImageLoad} from './SliderPopLayer';

export default class PopLayer extends NativeComponent {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show
        };
        this._closeAction = this._closeAction.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.show !== this.props.show) {
            this.setModalVisible(nextProps.show,nextProps.show ? () => {
                if(nextProps.type === 'vertical') {
                    this.rightInView && this.rightInView.slideInRight();
                }
                nextProps.showCallback && nextProps.showCallback();
            } : nextProps.hideCallback);
        }
    }
    setModalVisible(visible,callback) {
        this.setState({show: visible},() => {
            setTimeout(() => {
                callback && typeof callback === 'function' && callback();
            },0);
        });
    }
    _closeAction() {
        const isVertical = this.props.type === 'vertical';
        if(!isVertical) {
            this.props.hide && this.props.hide();
        }else{
            this.rightInView.slideOutRight(() => {
                this.backdropRef && this.backdropRef.setNativeProps({
                    opacity: 0
                });
                this.rightInView && this.rightInView.setNativeProps({
                    opacity: 0
                });
                this.props.hide && this.props.hide();
            });
        }
    }
    _renderContentView() {
        if(this.props.type === 'vertical') {
            return (
                <AnimateView
                    style={styles.verticalViewWrapper}
                    ref={ref => this.rightInView = ref}
                >
                    <View style={styles.verticalview}>
                        {
                            this.props.backImageSource ? (
                                <Image
                                    source={{uri: this.props.backImageSource}}
                                    style={styles.layerimgbgstyle}
                                />
                            ) : null
                        }
                        <View style={styles.verticalcontent}>
                            <View style={styles.closeBtn}>
                                <Text style={styles.closeBtnText} onPress={this._closeAction}>关闭</Text>
                            </View>
                            {
                                this._renderInner()
                            }
                        </View>
                    </View>
                </AnimateView>
            );
        }
        return this._renderInner();
    }
    _renderInner() {
        return (
            <View style={{flex: 1}}>
                <ImageLoad indicator={true} loading={this.props.isloading} ref={ref => this.imgloadref = ref} />
                {
                    !this.props.isloading && React.cloneElement(this.props.children,{
                        closeAction: this._closeAction,
                        ...this.props.injectProps
                    })
                }
            </View>
        );
    }
    render() {
        const {type} = this.props;
        const isVertical = type === 'vertical';
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={this.state.show}
                onRequestClose={this._closeAction}
            >
                <AnimateView
                    ref={ref => this.backdropRef = ref}
                    style={[styles.backdrop,isVertical ? {opacity: 0} : null]}
                />
                {
                    this._renderContentView()
                }
                {/* {
                    Platform.OS === 'ios' || (Platform.OS !== 'ios' && type === 'scroll') ? (
                        <View style={{flex: 1}} ref={ref => this.normallayerref = ref}>
                            <AnimateView
                                ref={ref => this.backdropRef = ref}
                                style={[styles.backdrop,isVertical ? {opacity: 0} : null]}
                            />
                            {
                                type === 'scroll' ? (
                                    this.state.isloading ? <ImageLoad indicator={true} loading={true} ref={ref => this.imgloadref = ref} /> : this._renderScrollView(false,component,undefined,contentProps)
                                )
                                    : null
                            }
                        </View>
                    ) : (
                        <AnimateView
                            ref={ref => this.backdropRef = ref}
                            style={[styles.backdrop,isVertical ? {opacity: 0} : null]}
                        />
                    )
                }
                {
                    isVertical ? this._renderScrollView(true,component,{backImageSource,isloading: this.state.isloading},contentProps) : null
                } */}
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    backdrop: {
        opacity: 0.9,
        backgroundColor: 'rgba(0,0,0,1)',
        width: deviceWidth,
        height: deviceHeight + 100,
        position: 'absolute',
        // flex: 1,
    },
    verticalViewWrapper: {
        width: deviceWidth,
        height: deviceHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    verticalview: {
        width: deviceHeight,
        height: deviceWidth,
        overflow: 'hidden',
        transform: [{rotate: '90deg'}]
    },
    //verticalcontent-只处理iphonex所引起的问题
    verticalcontent: {
        backgroundColor: 'rgba(0,0,0,.9)',
        flex: 1,
        height: deviceWidth,
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
    layerimgbgstyle: {
        width: deviceHeight,
        height: deviceWidth,
        position: 'absolute',
        // top: 0,
        // bottom: 0,
    },
});

