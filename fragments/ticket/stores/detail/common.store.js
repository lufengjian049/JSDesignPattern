//通用的数据
import {Store,ActionCreator} from '../../base/actor';

export const InitCommonData = ActionCreator('InitCommonData');

export default class CommonStore extends Store {
    createReceive() {
        return this.receiveBuilder()
            .match(InitCommonData,(commonData) => {
                const {spotinfo,...others} = commonData.data;
                //精简要暴露出的数据
                const params = ['spotid','spotname','resscount','id','inchina','isdomestic','gscid','scenicSpotFree','hasMainTicket','pfrom','imgurls','isquickin'];
                const curstate = params.reduce((state,param) => {
                    if(typeof spotinfo[param] !== void 0) {
                        state[param] = spotinfo[param];
                    }
                    return state;
                },{...others});
                this.setState(curstate);
            });
    }
}
