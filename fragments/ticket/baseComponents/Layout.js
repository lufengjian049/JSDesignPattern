/**
 * 简单的布局组件
 * lufj@ctrip.com
 * @providesModule Layout
 */
import React, {Component as NativeComponent} from 'react';
import PropTypes from 'prop-types';
import {View, TouchableOpacity, Image} from 'react-native';
import ReactNativePropRegistry from 'ReactNativePropRegistry';
import Label from 'Label';
import {deviceWidth,deviceHeight,normalize} from './util';

/**
 * -- 绝对定位布局
 * component 自定义根元素，默认View
 * fullscreen 全屏展示
 * vertical 垂直展示
 * onPress 点击事件
 * instance 获取根组件的实例
 * auto 自适应
 */
class AbsoluteView extends NativeComponent {
    render() {
        const {
            auto,component,fullscreen,children,style,vertical,onPress,...others
        } = this.props;
        const isFull = full => (full ? {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: vertical ? deviceHeight : deviceWidth,
            height: vertical ? deviceWidth : deviceHeight
        }
            : {});
        const defaultStyle = {
            position: 'absolute',
            ...isFull(fullscreen),
        };
        const Component = component || View;
        if(onPress) {
            return (
                <TouchableOpacity onPress={onPress} style={[defaultStyle,style,auto && style && getComputedStyle(style)]}>
                    {children}
                </TouchableOpacity>
            );
        }
        return (
            <Component
                ref={component => this._root = component}
                style={[defaultStyle,style,auto && getComputedStyle(style)]}
                {...others}
            >
                {children}
            </Component>
        );
    }
    componentDidMount() {
        const {instance} = this.props;
        instance && instance(this._root);
    }
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }
}
AbsoluteView.propTypes = {
    auto: PropTypes.bool,
};
AbsoluteView.defaultProps = {
    auto: true,
};

const cachedStyle = {};
function getComputedStyle(style) {
    if(!style) {
        return {};
    }
    let normalstyle;
    if(Array.isArray(style)) {
        normalstyle = style.reduce((acc,item) => {
            acc = {
                ...acc,
                ...getUniqeStyle(item),
            };
            return acc;
        },{});
    }else{
        normalstyle = getUniqeStyle(style);
    }
    const computeStyle = {};
    normalstyle.width && (computeStyle.width = normalize(normalstyle.width));
    normalstyle.height && (computeStyle.height = normalize(normalstyle.height));
    return computeStyle;
}
function getUniqeStyle(style) {
    let retstyle = style;
    if(typeof style === 'number') {
        if(cachedStyle[style]) {
            retstyle = cachedStyle[style];
        }else{
            retstyle = ReactNativePropRegistry.getByID(style);
            cachedStyle[style] = retstyle;
        }
    }
    return retstyle;
}
/**
 * 功能：
 * 1.自适应高度or宽度
 * 默认不进行适配，只有打开开关才会去适配auto:false
 * 2.自适应布局
 * type:column,row 默认为row
 * flex:xxxx
 * 3.自适应Image无url情况，无需其他额外配置
 * 4.自适应点击事件，传onPress即可
 */
class FlexView extends NativeComponent {
    render() {
        const {
            type,style,auto,flex,onPress,component,stylein,onLongPress = () => {},...others
        } = this.props;
        let {children} = this.props;
        const defaultStyle = {};
        if(type === 'column') {
            defaultStyle.flexDirection = 'row';
        }
        flex && (defaultStyle.flex = flex);
        let Component = component || View;
        //针对 自定义的Image元素，检查url
        if(Component === Image) {
            if(!others.source || (others.source && !others.source.uri)) {
                Component = View;
                defaultStyle.justifyContent = 'center';
                defaultStyle.alignItems = 'center';
                defaultStyle.backgroundColor = '#eef3f5';
                children = (
                    <Label type="commonicon" size={24} color="#d2d9de">&#xe0ae;</Label>
                );
            }
        }
        if(onPress) {
            if(stylein) {
                return (
                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={this.props.pressOpacity || 0.8}
                        // onLongPress={onLongPress}
                    >
                        <Component
                            ref={component => this._root = component}
                            style={[defaultStyle,style,auto && style && getComputedStyle(style)]}
                            {...others}
                        >
                            {children}
                        </Component>
                    </TouchableOpacity>
                );
            }
            return (
                <TouchableOpacity
                    onPress={onPress}
                    // onLongPress={onLongPress}
                    style={[defaultStyle,style,auto && style && getComputedStyle(style)]}
                    activeOpacity={this.props.pressOpacity || 0.8}
                >
                    <Component
                        ref={component => this._root = component}
                        {...others}
                    >
                        {children}
                    </Component>
                </TouchableOpacity>
            );
        }
        return (
            <Component
                ref={component => this._root = component}
                style={[defaultStyle,style,auto && style && getComputedStyle(style)]}
                {...others}
            >
                {children}
            </Component>
        );
    }
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }
    componentDidMount() {
        const {instance} = this.props;
        instance && instance(this._root);
    }
}
FlexView.propTypes = {
    auto: PropTypes.bool,
    type: PropTypes.oneOf(['row','column']),
    stylein: PropTypes.bool,
};
FlexView.defaultProps = {
    auto: false,
    type: 'row',
    stylein: false,
};

module.exports = {
    AbsoluteView,
    FlexView,
};
