/**
 * 收藏提示的状态
 */
import {Store,ActionCreator} from '../base/actor';
import {getPosFromHeight} from '../baseComponents/util';

const normalpos = {
    top: getPosFromHeight(),right: 13
};
export const FavoriteTipShow = ActionCreator('FavoriteTipShow');
export const FavoriteTipHide = ActionCreator('FavoriteTipHide');
export const FavoriteTipPause = ActionCreator('FavoriteTipPause');

export default class FavoriteTipStore extends Store {
    state = {
        show: false,
        //是否暂停动画响应的标识
        pause: false,
        resid: 0,
        oldpos: normalpos,
        pos: normalpos,
        androidModal: false,
    }
    createReceive() {
        return this.receiveBuilder()
            .match(FavoriteTipShow,({data}) => {
                const {pos = null,resid = 0} = data;
                const position = pos ? this.autoFixPosition(pos) : this.state.oldpos;
                this.setState({
                    show: true,
                    pos: position,
                    resid,
                    androidModal: !!pos,
                });
            })
            .match(FavoriteTipHide,() => {
                this.state.show && this.setState({
                    show: false,
                    androidModal: false,
                    resid: 0
                });
            })
            .match(FavoriteTipPause,({data}) => {
                const {pause} = data;
                this.setState({
                    pause
                });
            })
            .build();
    }
    autoFixPosition(pos) {
        //修正是因为箭头是居中显示了
        return pos.bottom ? {
            left: pos.left - 114 / 2,
            bottom: pos.bottom + 1
        } : pos;
    }
}
