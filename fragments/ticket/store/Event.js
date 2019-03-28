/**
 * event
 */
const ALL_EVENT = '@@ALL_EVENT';
const SLICE = [].slice;
export default class Event {
    constructor() {
        this._callbcaks = {};
        this._fired = {};
    }
    on(eventname,callback) {
        this._callbcaks[eventname] = this._callbcaks[eventname] || [];
        this._callbcaks[eventname].push(callback);
    }
    off(eventname,callback) {
        if(!eventname) {
            this._callbcaks = {};
        }else if(!callback) {
            this._callbcaks[eventname] = [];
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
    //全局事件，任意一个事件发起，都会触发
    all(callback) {
        this.on(ALL_EVENT,callback);
    }
}
export const event = new Event();
