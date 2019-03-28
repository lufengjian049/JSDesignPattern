/**
 * 坐标系统
 */
import {Store,ActionCreator} from '../base/actor';
import {UpdateIconType} from './detail/headertop.store';

export const UpdatePositionFromScroll = ActionCreator('UpdatePositionFromScroll');

export const UpdatePositionFromClick = ActionCreator('UpdatePositionFromClick');

function condationOnce(trulyfn,falslyfn) {
    let lastCondation;
    return function(condation) {
        if(condation !== lastCondation || typeof lastCondation === 'undefined') {
            condation ? trulyfn() : falslyfn();
            lastCondation = condation;
        }
    };
}

export default class PositionStore extends Store {
    state = {
        position: 0,
        // type: '',//fromclick | fromscroll
        animated: false,//true | false
    }
    createReceive() {
        return this.receiveBuilder()
            .match(UpdatePositionFromScroll,(pdata) => {
                this.state.position = pdata.data.position;
                this.condationOnceFromScroll(this.state.position > 30);
                //scroll to effect
            })
            .match(UpdatePositionFromClick,(pdata) => {
                this.setState({
                    ...pdata.data,
                });
            })
            .build();
    }
    preStart() {
        this.condationOnceFromScroll = condationOnce(() => {
            this.context.system.broadcast(new UpdateIconType(1));
        },() => {
            this.context.system.broadcast(new UpdateIconType(0));
        });
    }
}
