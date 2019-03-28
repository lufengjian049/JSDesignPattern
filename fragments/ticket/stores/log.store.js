/**
 * 日志监控
 */
import {Store} from '../base/actor';

export default class LogStore extends Store {
    createReceive() {
        return this.receiveBuilder()
            .matchAny((action) => {
                console.log('action:',Object.getPrototypeOf(action).constructor.name);
                console.log('data:',action.data);
            })
            .build();
    }
}
