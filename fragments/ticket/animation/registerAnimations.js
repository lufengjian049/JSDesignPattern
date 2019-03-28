//注册动画类型
const animationRegistry = {};

const cachedAnimation = {};
//转换为插值动画
export const createAnimation = (definition) => {
    const cachekey = JSON.stringify(definition);
    if(cachedAnimation[cachekey]) {
        return cachedAnimation[cachekey];
    }
    //插值动画先默认从0~1
    const positions = [0,1];
    const compiled = {};
    for(let i = 0; i < positions.length; i++) {
        const position = positions[i];
        let keyframe = definition[position];
        if(!keyframe) {
            if(position === 0) {
                keyframe = definition.from;
            }else if(position === 1) {
                keyframe = definition.to;
            }
        }
        Object.keys(keyframe).forEach((key) => {
            if(!(key in compiled)) {
                compiled[key] = {
                    inputRange: [],
                    outputRange: [],
                };
            }
            compiled[key].inputRange.push(position);
            compiled[key].outputRange.push(keyframe[key]);
        });
    }
    cachedAnimation[cachekey] = compiled;
    return compiled;
};

export function registerAnimation(animationName, animation) {
    animationRegistry[animationName] = animation;
}

export function getAnimationByName(animationName) {
    return animationRegistry[animationName];
}

export function getAnimationNames() {
    return Object.keys(animationRegistry);
}

export function initAnimations(animations) {
    Object.keys(animations).forEach((name) => {
        registerAnimation(
          name,
          createAnimation(animations[name]),
        );
    });
    // console.log(animationRegistry);
}
