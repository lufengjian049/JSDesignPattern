//lufj simple animation
import {View} from 'react-native';
import {initAnimations,getAnimationNames,createAnimation} from './registerAnimations';
import * as animations from './animations';
import createAnimationComponent from './createAnimationComponent';
import {makeSlideTranslation} from './util';

//将通用配置的动画，初始化并缓存
initAnimations(animations);
export const AnimateView = createAnimationComponent(View);

const animateTypes = getAnimationNames().reduce((accobj,aniname) => {
    accobj[aniname.toUpperCase()] = aniname;
    return accobj;
},{});
//延时执行后续队列
animateTypes.DELAY = 'delay';
//延时执行后续队列，但是在take过程中会被暂停，还要接受信号，从断点开始继续后续队列
animateTypes.TAKE = 'take';
export const AnimateTypes = animateTypes;

export function createAnimationParam(from,to,direction) {
    return createAnimation(makeSlideTranslation(direction === 'x' ? 'translateX' : 'translateY',from,to));
}

