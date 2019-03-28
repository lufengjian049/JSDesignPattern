//创建动画组件
import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { getAnimationNames, getAnimationByName } from './registerAnimations';

export default function createAnimationComponent(WrapperComponent) {
    const Animatable = Animated.createAnimatedComponent(WrapperComponent);
    //props: config
    class AnimatedComponent extends Component {
        constructor(props) {
            super(props);
            const animationValue = new Animated.Value(0);
            getAnimationNames().forEach((aniname) => {
                if(!(aniname in this)) { this[aniname] = this.animate.bind(this,aniname); }
            });
            // this.animationValue = animationValue;
            //animateQueue['fadeIn',delay(5000),'fadeOut']
            this.state = {
                animationValue,
                show: true,
                animationStyle: {},
                transitionStyle: {}
            };
            this.endAni = false;
            this.delay = this.delay.bind(this);
            this.take = this.take.bind(this);
        }
        getInterpolateStyle(compiledAnimation,aniValue) {
            const TRANSFORM_STYLES = ['translateX','translateY'];
            return Object.keys(compiledAnimation).reduce((style,key) => {
                if(~TRANSFORM_STYLES.indexOf(key)) {
                    if(!style.transform) {
                        style.transform = [];
                    }
                    style.transform.push({
                        [key]: aniValue.interpolate(compiledAnimation[key])
                    });
                }else{
                    style[key] = aniValue.interpolate(compiledAnimation[key]);
                }
                return style;
            },{});
        }
        animate(aniname,callback,duration) {
            const {animationValue} = this.state;
            const compiledAnimation = typeof aniname == 'string' ? getAnimationByName(aniname) : aniname;
            const animationStyle = this.getInterpolateStyle(compiledAnimation, animationValue);
            animationValue.setValue(0);
            !this.endAni && this.setState({animationStyle},() => {
                this.startAnimation(animationValue,callback,duration);
            });
        }
        transitionTo(styleobj,callback,duration) {
            const {stylename,fromValue,toValue} = styleobj;
            const compiledAnimation = {
                [stylename]: {
                    inputRange: [0,1],
                    outputRange: [fromValue,toValue]
                }
            };
            const {animationValue} = this.state;
            const transitionStyle = this.getInterpolateStyle(compiledAnimation,animationValue);
            animationValue.setValue(0);
            !this.endAni && this.setState({transitionStyle},() => {
                this.startAnimation(animationValue,callback,duration);
            });
        }
        startAnimation(animationValue,callback,duration) {
            !this.endAni && Animated.timing(animationValue,{
                toValue: 1,
                duration: duration || 300,
                easing: Easing.linear,
                useNativeDriver: true
            }).start(() => {
                !this.endAni && callback && callback();
            });
        }
        stopAnimation(callback) {
            const {animationValue} = this.state;
            animationValue.stopAnimation(callback);
        }
        setNativeProps(props) {
            this.ref && this.ref.setNativeProps(props);
        }
        shouldComponentUpdate(nextProps) {
            if(this.props.pause !== nextProps.pause && nextProps.pause) {
                //按了暂停键了
                this.animationPause = true;
                return false;
            }
            if(this.props.pause !== nextProps.pause && !nextProps.pause) {
                //重新开始了
                //处理有可能快速返回后，还没有走到laterBack,这种情况还是直接运行后续步骤，不作"暂停"
                this.laterBack ? this.laterBack() : (this.animationPause = false);
                return false;
            }
            return true;
        }
        componentWillUnmount() {
            this.endAni = true;
        }
        delay(callback,duration = 1000) {
            setTimeout(() => {
                callback && callback();
            },duration);
        }
        //可以暂停的任务
        take(callback,duration = 1000) {
            setTimeout(() => {
                if(this.animationPause) {
                    //暂停的话，将后续事件缓存起来，等待重新触发
                    this.laterBack = callback;
                    //做后续promise的缓存，可能会造成潜在的内存泄漏，推翻该方案,再优化
                }else{
                    //暂停了的话，先不行callback
                    callback && callback();
                }
            },duration);
        }
        //TODO: 要取消任务
        executeQueue(queue) {
            const promiseChain = queue.reduce((result,queueitem,index) => {
                const {name: aniname,duration} = queueitem;
                const anipromisename = `${aniname + '_' + duration}_promise`;
                if(!this[anipromisename]) {
                    this[anipromisename] = function() {
                        return new Promise((resolve,reject) => {
                            this[aniname](() => {
                                //添加一个已经完结的队列标识，后续会根据该标识做优化
                                this.completeAniIndex = index;
                                resolve('animateEnd');
                            },duration);
                        });
                    };
                }
                return result.then(() => (this.endAni ? '' : this[anipromisename]()));
            },Promise.resolve());
            if(this.props.queueEndHide) {
                promiseChain.then(() => {
                    if(!this.endAni) {
                        this.props.endCallback ? this.props.endCallback() : (this.setState({
                            show: false
                        }));
                    }
                });
            }
        }
        componentDidMount() {
            if(this.ref && this.props.animationQueue && this.props.animationQueue.length) {
                this.executeQueue(this.props.animationQueue);
            }
        }
        render() {
            // const transation = this.animationValue.interpolate()
            const {pointerEvents} = this.props;
            if(!this.state.show) {
                return null;
            }
            return (<Animatable
                ref = {instance => this.ref = instance}
                style={[this.props.style,this.state.animationStyle,this.state.transitionStyle]}
                pointerEvents={pointerEvents || 'auto'}
            >
                {this.props.children}
            </Animatable>);
        }
    }
    AnimatedComponent.defaultProps = {
        queueEndHide: true,
        animationQueue: []
    };
    return AnimatedComponent;
}

//TODO: 动画的可配置，可暂停(暂停后再继续)

// 动画队列，配置严格要求从开始到结束，结束后默认隐藏动画相关元素!!
// animationQueue = [
//     {
//         name: 'fadeIn',
//         duration: 400,
//     },{
//         name: 'delay',
//         duration: 500,
//     },{
//         name: 'fadeOut',
//         duration: 400
//     }
// ]
