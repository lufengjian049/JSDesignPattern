//定义的动画类型
import { Dimensions } from 'react-native';
import {makeSlideTranslation} from './util';

const { height, width } = Dimensions.get('window');

export const slideInDown = makeSlideTranslation('translateY', -height, 0);

export const slideInUp = makeSlideTranslation('translateY', height, 0);

export const slideInLeft = makeSlideTranslation('translateX', -width, 0);

export const slideInRight = makeSlideTranslation('translateX', width, 0);

export const slideOutDown = makeSlideTranslation('translateY', 0, height);

export const slideOutUp = makeSlideTranslation('translateY', 0, -height);

export const slideOutLeft = makeSlideTranslation('translateX', 0, -width);

export const slideOutRight = makeSlideTranslation('translateX', 0, width);

export const fadeIn = makeSlideTranslation('opacity', 0, 1);

export const fadeOut = makeSlideTranslation('opacity', 1, 0);
