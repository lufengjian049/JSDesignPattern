/**
 * lufj@ctrip.com 将Text包一层，已做一些适配工作。
 * type:text(默认，普通文本),commonicon(携程通用库icon),ttdicon(玩乐字体库icon)
 * color: 字体颜色
 * size: 字体大小，默认14
 * text: 文本
 * auto： 是否自适应字体大小,默认true
 * @providesModule Label
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text,StyleSheet} from 'react-native';
import {normalize} from './util';

export default class Label extends Component {
    render() {
        this.buildProps();
        const {children} = this.props;
        if(typeof children === 'string' && !children) {
            return null;
        }
        return (
            <Text {...this.props} />
        );
    }
    buildProps() {
        let {
            type,auto,color,size: fontSize,text,style,children,...otherProps
        } = this.props;
        // if(auto) {

        //     fontSize = normalize(fontSize);
        // }
        let curfontstyle = styles[`fontsize${fontSize}`];
        !curfontstyle && (curfontstyle = {fontSize: normalize(fontSize)});
        let stylearr = [];
        let normalstyle = null;
        if(color) {
            normalstyle = {
                color,
                overflow: 'hidden',
            };
        }
        if(type === 'commonicon') {
            stylearr = stylearr.concat(styles.commoniocnstyle);
        }else if(type === 'ttdicon') {
            stylearr = stylearr.concat(styles.ttdiconstyle);
        }else{
            stylearr = stylearr.concat(styles.normaltextstyle);
        }
        stylearr = stylearr.concat(curfontstyle,normalstyle,style);
        if(text || text === 0) children = text;
        this.props = {
            style: stylearr,
            children,
            ...otherProps
        };
    }
}

Label.propTypes = {
    //是否自适应字体大小，默认开启
    auto: PropTypes.bool,
    // color: PropTypes.string,
    size: PropTypes.number,
    text: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
    type: PropTypes.oneOf(['text','commonicon','ttdicon'])
};
Label.defaultProps = {
    auto: false,
    // color: '#000',
    size: 14,
    text: '',
    type: 'text'
};
const styles = StyleSheet.create({
    ttdiconstyle: {
        fontFamily: 'crn_font_ttd_ticket',
        fontSize: normalize(10),
        color: '#fff',
    },
    commoniocnstyle: {
        fontFamily: 'ct_font_common',
        fontSize: normalize(10),
        color: '#fff',
    },
    normaltextstyle: {
        fontSize: normalize(14),
        color: '#000',
    },
    fontsize10: {
        fontSize: normalize(10),
    },
    fontsize11: {
        fontSize: normalize(11),
    },
    fontsize12: {
        fontSize: normalize(12),
    },
    fontsize13: {
        fontSize: normalize(13),
    },
    fontsize14: {
        fontSize: normalize(14),
    },
    fontsize15: {
        fontSize: normalize(15),
    },
    fontsize16: {
        fontSize: normalize(16),
    },
    fontsize20: {
        fontSize: normalize(20),
    },
    fontsize22: {
        fontSize: normalize(22),
    },
    fontsize24: {
        fontSize: normalize(24),
    },
});
