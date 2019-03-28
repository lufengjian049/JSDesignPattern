/**
 * 主子景点
 */
import {Store,ActionCreator} from '../../base/actor';
import {getSpotPriceInfo} from '../../DataConvert';

export const InitChildSpotList = ActionCreator('InitChildSpotList');

export default class ChildSpotStore extends Store {
    state = {
        viewspots: [],
        hasSpots: false
    }
    createReceive() {
        return this.receiveBuilder()
            .match(InitChildSpotList,({data}) => {
                this.setState(this.mapSpotsList(data));
            })
            .build();
    }
    mapSpotsList(data) {
        data.viewspots.forEach(item => getSpotPriceInfo(item));
        data.title = data.islocalmain ? '景区内景点' : '相关景点';
        data.spotscount = data.viewspots.length;
        data.isSingle = data.spotscount === 1;
        data.hasSpots = data.spotscount > 0;
        return data;
    }
}
