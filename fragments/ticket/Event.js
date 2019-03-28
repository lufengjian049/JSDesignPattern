/**
 * EventBus 总线机制
 * lufj@ctrip.com
 */
const ALL_EVENT = '@@ALL_EVENT';
const SLICE = [].slice;
const CONCAT = [].concat;
class Event {
    constructor() {
        this._callbcaks = {};
        this._fired = {};
        this._eventdata = {};
        this._eventname = [];
        this._pattern = {};
        this._patternReg = {};
    }
    on(eventname,callback) {
        this._callbcaks[eventname] = this._callbcaks[eventname] || [];
        this._callbcaks[eventname].push(callback);
        this._eventname.push(eventname);
        Object.keys(this._pattern).forEach((patternkey) => {
            const curreg = this._patternReg[patternkey];
            if(curreg.test(eventname)) {
                this._pattern[patternkey].push(eventname);
            }
        });
    }
    off(eventname,callback) {
        if(!eventname) {
            this._callbcaks = {};
            this._eventdata = {};
        }else if(!callback) {
            this._callbcaks[eventname] = [];
            this._eventdata[eventname] = null;
        }else{
            const callbacklist = this._callbcaks[eventname];
            if(callbacklist) {
                const listlength = callbacklist.length;
                for(let i = 0; i < listlength; i++) {
                    if(callback == callbacklist[i]) {
                        callbacklist[i] = null;
                        break;
                    }
                }
            }
        }
    }
    trigger(eventname,data) {
        //只暂存第一个data值
        this._eventdata[eventname] = data;
        const callbacks = this._callbcaks;
        //两种类型事件，一个全局的事件，一个是当前触发的事件
        let both = 2,callback;
        while(both--) {
            const ev = both ? eventname : ALL_EVENT;
            const list = callbacks[ev];
            if(list) {
                const l = list.length;
                for(let i = 0; i < l; i++) {
                    if(callback = list[i]) {
                        callback.apply(this,SLICE.call(arguments,both ? 1 : 0));
                    }
                }
            }
        }
    }
    //通配模式
    emit(type,data) {
        console.log('emit',type,Object.getPrototypeOf(data).constructor.name);
        if(type === '**') {
            this.triggerAll(type,data);
            return;
        }
        const names = type.split('/');
        if(names.length > 1) {
            if(!this._pattern[type]) {
                (!this._pattern[type]) && (this._pattern[type] = []);
                const reg = new RegExp(`${type.replace(/\*/g,'[\\w]+')}$`);
                this._eventname.forEach((name) => {
                    if(reg.test(name)) {
                        this.triggerByName(name,data);
                        this._pattern[type].push(name);
                    }
                });
                this._patternReg[type] = reg;
                // this.triggerByName(ALL_EVENT,data);
            }else{
                this._pattern[type].forEach(name => this.triggerByName(name,data));
            }
            this.triggerByName(ALL_EVENT,data);
        }else{
            this.trigger(type,data);
        }
    }
    triggerByName(name,data) {
        this._callbcaks[name].forEach(callback => callback.apply(this,SLICE.call(arguments,1)));
    }
    triggerAll() {
        Object.keys(this._callbcaks).forEach((callbackkey) => {
            if(callbackkey) {
                this._callbcaks[callbackkey].forEach(callback => callback.apply(this,SLICE.call(arguments,1)));
            }
        });
    }
    getEventData(eventname) {
        return this._eventdata[eventname];
    }
    //全局事件，任意一个事件发起，都会触发
    all(callback) {
        this.on(ALL_EVENT,callback);
    }
    unbindAll(callback) {
        this.off(ALL_EVENT,callback);
    }
    once(eventname,callback) {
        const wrapper = (...datas) => {
            callback.apply(this,[...datas]);
            this.off(eventname,wrapper);
        };
        this.on(eventname,wrapper);
    }
    //after all events fired,callback executed once
    //onceAnd(ev1,ev2,callback)
    //onceAnd([ev1,ev2],callback)
    //onceAnd(ev1,[ev2,ev3],callback)
    onceAnd() {
        const [callback,...events] = CONCAT.apply([],arguments).reverse();
        this._assign(callback,true,...events.reverse());
    }
    //after all events fired,callback executed , and any event fired, the callback executed again
    and() {
        const [callback,...events] = CONCAT.apply([],arguments).reverse();
        this._assign(callback,false,...events.reverse());
    }
    _assign(callback,isOnce,...events) {
        const argslength = arguments.length;
        let times = 0;
        const flag = {};
        if(argslength < 3) {
            return;
        }
        const method = isOnce ? 'once' : 'on';
        const bind = (key) => {
            this[method](key,(data) => {
                !this._fired[key] && (this._fired[key] = {});
                this._fired[key].data = data;
                if(!flag[key]) {
                    flag[key] = true;
                    times++;
                }
            });
        };
        events.forEach(eventname => bind(eventname));
        const _all = (event) => {
            if(times < events.length) {
                return;
            }
            //防止多个and事件交叉触发的情况，只有触发的event是当前绑定的event才需要触发当前的callback
            if(!flag[event]) {
                return;
            }
            const data = events.map(ev => this._fired[ev].data);
            if(isOnce) {
                this.unbindAll(_all);
            }
            callback.apply(this,data);
        };
        this.all(_all);
    }
}
// Event.prototype.emit = Event.prototype.triggerAll;
Event.prototype.addListen = Event.prototype.on;
Event.prototype.removeAllListeners = Event.prototype.off;
Event.prototype.removeListener = Event.prototype.off;

export {Event};

export default new Event();
