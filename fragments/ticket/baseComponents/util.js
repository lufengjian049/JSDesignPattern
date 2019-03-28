/**
 * lufj@ctrip.com
 * 一些公用的数据&&方法
 * @providesModule Util
 */

import {
    Dimensions,
    PixelRatio,
    Platform,
    StyleSheet,
} from 'react-native';
import {Device} from '@ctrip/crn';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
export const p1x = 1 / PixelRatio.get();

const cachedvalue = {};
export const isios = Platform.OS === 'ios';
const scale = deviceWidth / 375;
//设计不需要做 字体的自适应。。hehe...
export function normalize(value,needscale = false) {
    if(!needscale) {
        return value;
    }
    if(cachedvalue[value]) {
        return cachedvalue[value];
    }
    let scaleValue = Math.round(scale * value);
    (value > 0 && scaleValue === 0) && (scaleValue = p1x);
    cachedvalue[value] = scaleValue;
    return scaleValue;
}
export const TITLESIZE = normalize(17);
export const commonStyle = StyleSheet.create({
    titleStyle: {
        fontSize: TITLESIZE,
        color: '#333',
        fontWeight: '600',
        ...Platform.select({android: {fontWeight: '500'}})
    }
});

//样式相关
//详情页用的比较多的color，支付，金额色值 etc...
export const ORANGE_COLOR = '#ff7d13'; //255,125,19
export const PRICE_COLOR = '#ff4400';
export const BORDER_COLOR = '#e9e9e9';
export const BLUE_COLOR = '#19a0f0'; //25,160,240
export const ORANGE_COLOR_RGBA = '255,125,19';
export const BLUE_COLOR_RGBA = '25,160,240';
export const CAROUSEL_HEIGHT = Math.floor((deviceWidth / 375) * 190);
export const HEADER_HEIGHT = (Platform.OS === 'ios') ? (Device.isiPhoneX ? 44 + 44 : 44 + 20) : 50;
export const TabAllTypes = ['shelf','act','shx'];
export const getTabType = type => TabAllTypes[type - 1];
export function initPosition() {
    position = {};
    sortedpos = [];
    positiontoid = {};
    positionChange = false;
}
// export const mapPosition = pos => Platform.OS === 'ios' && Device.isiPhoneX ? pos + 24 : pos;
export const getPosFromHeight = offset => HEADER_HEIGHT + (offset || 0);
//收集 货架坐标
const contentheight = deviceHeight - HEADER_HEIGHT - 50;
let position = {};
let sortedpos = [];
let positiontoid = {};
const unitpostions = {};
export const collectionUnitPostion = (id,y) => {
    unitpostions[id] = Math.floor(y);
};
export const getUnitPosition = id => (unitpostions[id] ? (unitpostions[0] + unitpostions[id]) : 0);
export const getUnitPostionObj = () => unitpostions;
//type: shelf act shx
export const collectionShelfPosition = (id,y,type,asyncModule = false) => {
    y = Math.floor(y);
    if(id === 'shelftab' || id === 'recommend') {
        position[id] = y;
        return;
    }
    if((type + id) in position && y !== position[type + id]) {
        positionChange = true;
    }
    if(asyncModule) {
        positionChange = true;
    }
    position[type + id] = y;
    if(id !== 0) {
        !position[type] && (position[type] = {});
        position[type][id] = y;
    }
};
let positionChange = false;
let computedPos = {};
const positionEnableScroll = {};
export const getPosition = (compute,lasty) => {
    // if(!isios) {
    //     positionChange = true;
    // }
    if((positionChange || !sortedpos.length) && compute) {
        positiontoid = {};
        sortedpos = [];
        //重新计算
        computedPos = TabAllTypes.reduce((pos,type) => { //['shelf','shx','act']
            const curtype = position[type]; // {shelf:{id:y}}
            if(curtype) {
                for(const id in curtype) {
                    const curposid = type + id;
                    const curpos = position[type + '0'] + curtype[id];
                    pos[curposid] = curpos;
                    positiontoid[curpos] = curposid;
                    positionEnableScroll[curposid] = !(curpos + contentheight > lasty);
                    sortedpos.push(curpos);
                }
            }
            if(type === 'shelf' && !curtype && position.shelf0 !== undefined) {
                const curpos = position.shelf0;
                sortedpos.push(curpos);
                positiontoid[curpos] = 'shelf0';
            }
            return pos;
        },{});
        // if(isios) {
        //     sortedpos = sortedpos.sort((a,b) => a > b);
        // }else{
        sortedpos = quickSort(sortedpos);
        // }
        positionChange = false;
    }
    return {
        sortedpos,
        positiontoid,
        position,
        computedPos,
        positionEnableScroll,
    };
};
function quickSort(arr) {
    if (arr.length <= 1) { return arr; }
    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr.splice(pivotIndex,1)[0];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length; i++) {
        if(arr[i] < pivot) {
            left.push(arr[i]);
        }else{
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([pivot],quickSort(right));
}
//处理Android坐标缓存问题
let hasChangedPostion = false;
export const changedPostion = (changed = true) => {
    hasChangedPostion = changed;
};
export const getChangedPostion = () => hasChangedPostion;
export const parseQuery = json => Object.keys(json).reduce((str,key) => {
    str += `${key}=${json[key]}&`;
    return str;
},'').slice(0,-1);
export const combineUrl = (path,query) => `/${path}?${parseQuery(query)}`;
//时间格式化
export const dateFormat = (date,format) => {
    date = new Date(date);
    const o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
    };
    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for(const k in o) {
        if(new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return format;
};
export const couponErrCode = {
    //[按钮文本，toast提示，按钮状态：0不可用，1可用]
    0: ['已领取','您已成功领取！',0],
    5016: ['新客专享','此优惠券仅供携程新客领用',0],
    5011: ['已领取','您已成功领取！',0],
    5022: ['已领取','您已领过该优惠券了',0],
    5008: ['暂不可领','领取未成功，请联系携程客服',0],
    5005: ['暂不可领','领取未成功，请联系携程客服',0],
    5013: ['暂不可领','您已领过该优惠券了',0],
    5014: ['立即领取','抢券的人太多，请稍后再试！',1],
    5015: ['立即领取','出错了，请稍后再试',1],
    12: ['立即领取','活动尚未开始，请联系携程客服',1],
    5010: ['已抢光','啊呀，优惠券已被抢完了',0],
    5: ['活动已\r\n结束','活动已结束，下次请早哦',0],
};
export function once(fn) {
    let called = false;
    return (...args) => {
        if(!called) {
            called = true;
            fn(...args);
        }
    };
}
//将文本中的br和回车等全部替换掉
export function trimBR(str) {
    return str && str.replace(/(\r\n)|(\n)|(<[^>]+>)/g,'') || '';
}
