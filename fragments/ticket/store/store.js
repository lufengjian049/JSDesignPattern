/**
 * 数据处理中心
 * 用EventBus发事件去更新数据
 * lufj
 */
//把异步请求等的副作用，隔离在action中
import Event from './Event';

const initstate = {
    pageid: 10320662469,
    loading: true,
    error: false,
    islogin: false,
    recommends: {
        name: '',
        list: []
    },
    skills: {
        list: [],
    },
    shelfinfo: {},
    spotinfo: {},
    layer: {
        show: false,
        loading: false,
        timestamp: 0,
    },
};
// import {Toast} from '@ctrip/crn';

//单独订阅key？还是订阅ALL_EVENT??
class Store extends Event {
    constructor({state,actions,mutations}) {
        super();
        this.state = state || initstate;
        this.actions = actions;
        this.mutations = mutations;
        // this.all((action,data) => {
        //     console.log(action,JSON.parse(JSON.stringify(data)));
        // });
    }
    //发起一个同步action,payload -> mutation 处理数据
    // commit(mutationtype,payload) {
    //     this._commit.call(this,'',mutationtype,payload);
    // }
    _commit(launchaction,mutationtype,payload) {
        this.mutations[mutationtype] && this.mutations[mutationtype].call(this,this.state,payload);
        //state更新好后
        this.trigger(launchaction,this.state);
    }
    //发起一个action
    dispatch(action,data,callback) {
        //负责获取初始状态信息
        if(callback) {
            callback.call(this,this.state,true);
        }
        this.actions[action] && this.actions[action].call(this,{
            commit: this._commit.bind(this,action),
            state: this.state
        },data);
        this.on(action,(data) => {
            //由加了全局事件引起，执行该回调时trigger会被阻塞(同步去setState更新组件状态)
            Promise.resolve().then(() => {
                callback && callback.call(this,this.state,false);
            });
            // setTimeout(() => {
            //     callback && callback.call(this,this.state,false);
            // },0);
        });
    }
    getState() {
        return this.state;
    }
    subscribe(callback) {
        this.all(callback);
    }
}
export default Store;
