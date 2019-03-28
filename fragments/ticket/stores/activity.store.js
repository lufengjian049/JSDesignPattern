/**
 * 当地玩乐
 */
import {Store} from '../base/actor';
import * as services from '../services';

class FetchActivityData {
    constructor(param) {
        this.param = param;
    }
}
class ActivityStore extends Store {
    createReceive() {
        return this.receiveBuilder()
            .match(FetchActivityData, (param) => {

            })
            .build();
    }
}
