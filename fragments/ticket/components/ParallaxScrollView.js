/**
 * lufj@ctrip.com
 * 详情页头部滚动 && 收藏的功能
 */
import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    Platform,
} from 'react-native';
import {
    Share,
    LinearGradient,
} from '@ctrip/crn';
import {AbsoluteView} from 'Layout';
import {throttle} from 'lodash';
import Label from 'Label';
import {deviceWidth} from '../baseComponents/util';
import detailAction from '../detail.action';

import HeaderBottom from './headtopcomponents/HeaderBottom';
import FavoriteBtn from './headtopcomponents/HeaderFavorite';
import WrappedIcon from './headtopcomponents/WrappedIcon';
import PositionStore,{UpdatePositionFromScroll} from '../stores/position.store';
import CommonStore from '../stores/detail/common.store';
import { Connect } from '../base/actor-react';
import {getShareData} from '../DataConvert';

const isIOS = Platform.OS === 'ios';
class ParallaxScrollView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
        };
        const positionStoreIns = this.props.system.get(PositionStore);
        this.state.scrollY.addListener(throttle((scroll) => {
            this.props.scrollEvent(scroll);
            positionStoreIns.tell(new UpdatePositionFromScroll({
                position: scroll.value
            }));
        },80));
        this.primeIconColors = {
            normal: {0: '#fff', 1: '#000'},
            favorite: {0: '#fff', 1: '#ff7d13'}
        };
    }
    shouldComponentUpdate(nextProps) {
        if(nextProps.position && nextProps.position !== this.props.position) {
            this.pScrollTo(nextProps.position,nextProps.animated);
            return false;
        }
        return true;
    }
    render() {
        const {
            bgheight,headheight,style,renderBackground,shouldStickyHeader,stickyIndex,position,animated,system, ...props
        } = this.props;

        return (
            <View
                style={[styles.container, style]}
            >
                {this._renderBackground()}
                {this._rendernavBar()}
                <Animated.ScrollView
                    ref={(component) => {
                        this._scrollView = component;
                    }}
                    {...props}
                    // style={styles.scrollView}
                    onScroll={Animated.event([
                        { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
                    ], { useNativeDriver: true })}
                    contentContainerStyle={{paddingTop: bgheight - headheight}}
                    scrollEventThrottle={1}
                    stickyHeaderIndices={shouldStickyHeader ? [stickyIndex] : []}
                >
                    {this.props.children}
                </Animated.ScrollView>
            </View>
        );
    }

    pScrollTo(y = 0,animated = true) {
        this._scrollView && this._scrollView._component && this._scrollView._component.scrollTo({
            y,
            animated
        });
    }
    // 背景和景点名区域
    _renderBackground() {
        // console.log('_renderBackground');
        const { bgheight,renderBackground,baseinfo } = this.props;
        const { scrollY } = this.state;
        if (!bgheight) {
            return null;
        }
        return (
            <Animated.View style={[
                {height: bgheight},
                styles.background,
                {
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [-bgheight, 0, bgheight],
                                outputRange: [bgheight / 2, 0, -bgheight],
                            })
                        }
                    ]
                }
            ]}
            >
                <Animated.View
                    style={[
                        {
                            transform: [
                                {
                                    scale: scrollY.interpolate({
                                        inputRange: [-bgheight, 0, bgheight],
                                        outputRange: [2, 1, 1]
                                    })
                                }
                            ]
                        }
                    ]}
                >
                    {
                        renderBackground ? renderBackground() : null
                    }
                </Animated.View>
                <Animated.View
                    style={[
                        styles.headerbottom,
                        {
                            transform: [
                                {
                                    translateY: scrollY.interpolate({
                                        inputRange: [-bgheight, 0,bgheight],
                                        outputRange: [bgheight / 2, 0,0],
                                    })
                                }
                            ]
                        }
                    ]}
                >
                    <HeaderBottom {...baseinfo} />
                </Animated.View>
            </Animated.View>
        );
    }
    getHeaderInterpolate(scrollY,headheight,type,fromnum = 0.2) {
        let outputranage = [0, 0, 1];
        if(type === 'btn') {
            outputranage = [1, 1, 0];
        }
        return scrollY.interpolate({
            inputRange: [-headheight, headheight * fromnum, headheight * 2],
            outputRange: outputranage,
            extrapolate: 'clamp'
        });
    }
    // 头部按钮区域
    _rendernavBar() {
        const {
            headheight,page,baseinfo
        } = this.props;
        const { scrollY } = this.state;
        const ptop = headheight - 44 + (44 - 38) / 2 + 2;
        const getInterpolate = this.getHeaderInterpolate.bind(this,scrollY, headheight);
        const {normal: normalIconColors, favorite: favoriteIconColors} = this.primeIconColors;
        return (
            <View style={{height: headheight,zIndex: 10}}>
                <Animated.View style={[styles.headerbtn,{left: 3,top: ptop,opacity: getInterpolate('btn')}]} />
                <AbsoluteView
                    auto={false}
                    style={[styles.headerbtn,{
                        left: 3,top: ptop,backgroundColor: 'transparent',zIndex: 9
                    }]}
                    onPress={() => page.pop()}
                >
                    <WrappedIcon>
                        {
                            headerIconType => (
                                <Label type="commonicon" size={26} color={normalIconColors[headerIconType]}>&#xe015;</Label>
                            )
                        }
                    </WrappedIcon>
                </AbsoluteView>
                {
                    baseinfo.isinit ? null : (
                        <View>
                            <Animated.View
                                style={[styles.headertitle,{
                                    height: headheight,
                                    paddingTop: headheight - 44,
                                    opacity: getInterpolate('title')
                                }]}
                            >
                                <ReactiveHeader title={baseinfo.name} />
                            </Animated.View>
                            <Animated.View style={[styles.headerbtn,{right: 50,top: ptop,opacity: getInterpolate('btn')}]} />
                            <AbsoluteView
                                auto={false}
                                style={[styles.headerbtn,{
                                    right: 50,top: ptop,backgroundColor: 'transparent',zIndex: 9
                                }]}
                            >
                                <WrappedIcon>
                                    {
                                        headerIconType => (
                                            <FavoriteBtn
                                                iconchange={!!headerIconType}
                                                defaultColor={normalIconColors[headerIconType]}
                                                selectedColor={favoriteIconColors[headerIconType]}
                                            />
                                        )
                                    }
                                </WrappedIcon>
                            </AbsoluteView>
                            <Animated.View style={[styles.headerbtn,{right: 6,top: ptop,opacity: getInterpolate('btn')}]} />
                            <AbsoluteView
                                auto={false}
                                style={[styles.headerbtn,{
                                    right: 6,top: ptop,backgroundColor: 'transparent',zIndex: 9
                                }]}
                            >
                                <WrappedIcon>
                                    {
                                        icontype => (
                                            <Label
                                                type="commonicon"
                                                color={normalIconColors[icontype]}
                                                size={28}
                                                onPress={() => {
                                                    detailAction.logTraceShare(this.props);
                                                    Share.customShare({
                                                        dataList: getShareData(this.props),
                                                        businessCode: 'ttd_spot'
                                                    });
                                                }}
                                            >&#xe020;
                                            </Label>
                                        )
                                    }
                                </WrappedIcon>
                            </AbsoluteView>
                        </View>
                    )
                }
                <Animated.View
                    style={[{
                        height: 3,width: deviceWidth,position: 'absolute',bottom: -3,opacity: getInterpolate('title',1.6)
                    },isIOS ? null : {bottom: 0}]}
                >
                    <LinearGradient
                        style={{
                            flex: 1
                        }}
                        colors = {['rgba(237,237,237,1)','rgba(255,255,255,1)']}
                        locations={[0.4,1]}
                    />
                </Animated.View>
            </View>
        );
    }
}
class ReactiveHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            twoline: false
        };
        this.maxval = Platform.OS === 'ios' ? 20 : 25;
    }
    render() {
        if(this.state.twoline) {
            return (
                <Label text={this.props.title} size={14} color="#000" numberOfLines={2} />
            );
        }
        return (
            <Label
                onLayout={(e) => {
                    if(e.nativeEvent.layout.height > this.maxval) {
                        this.setState({twoline: true});
                    }
                }}
                text={this.props.title}
                size={18}
                color="#000"
            />
        );
    }
}
export default Connect([PositionStore,CommonStore])(ParallaxScrollView);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        position: 'absolute',
        zIndex: 9,
    },
    headerbtn: {
        position: 'absolute',
        width: 38,
        height: 38,
        marginLeft: 6,
        borderRadius: 19,
        backgroundColor: 'rgba(51,51,51,.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    headertitle: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: deviceWidth,
        opacity: 0,
        paddingLeft: 40,
        paddingRight: 86,
    },
    headerbottom: {
        position: 'absolute',
        bottom: 0,
        width: deviceWidth,
    },
});
