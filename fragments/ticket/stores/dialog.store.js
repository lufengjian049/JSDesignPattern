/**
 * Slider浮层状态和数据
 */
import {Store,ActionCreator} from '../base/actor';
import {getNoticeInfo} from '../services';
import CommonStore from './detail/common.store';
import {FavoriteTipHide} from './favoritetip.store';

export const DialogResDetailShow = ActionCreator('DialogResDetailShow');

export const DialogCouponShow = ActionCreator('DialogCouponShow');

export const DialogPoliciesShow = ActionCreator('DialogPoliciesShow');

export const DialogNotifyShow = ActionCreator('DialogNotifyShow');

export const DialogHide = ActionCreator('DialogHide');

const initState = {
    show: false,
    data: {},
    loading: false,
    mode: '',//resdetail | coupon | policies | notify
};
export default class DialogStore extends Store {
  state = initState
  createReceive() {
      return this.receiveBuilder()
          .match(DialogNotifyShow,({data}) => {
              //TODO:打开浮层也会有其他的一些副作用，关闭可能还在打开的浮层layer
              //event.trigger('pagetip_hide');
              const {pageid,spotid} = this.getCommonState();
              this.setState({
                  show: true,
                  loading: true,
                  mode: 'notify',
                  ...this.getAddonProps(data),
              });
              this.fetchNoticeInfo(spotid,pageid);
          })
          .match(DialogHide,() => {
              if(!this.state.show) {
                  return;
              }
              this.setState(initState);
              //TODO:关闭方法的副作用-- resdetail 关闭收藏的浮层
              //event.trigger('favoritetip_hide');
              this.hideFavoriteTip();
          })
          .build();
  }
  getAddonProps(data) {
      return {
          hide: this.hideDialog.bind(this),
          showCallback: data && data.showCallback || null,
          hideCallback: data && data.hideCallback || null,
      };
  }
  getCommonState() {
      return this.context.parent().getContext().get(CommonStore).getInstance().state;
  }
  hideDialog() {
      this.context.system.broadcast(new DialogHide(),1);
  }
  hideFavoriteTip() {
      this.context.system.broadcast(new FavoriteTipHide(),1);
  }
  fetchNoticeInfo(spotid,pageid) {
      getNoticeInfo({
          pageid: pageid,
          resourcetype: 1,
          searchtype: 2,
          viewid: spotid
      }).then((response) => {
          if (response.head.errcode === 0) {
              this.setState({
                  loading: false,
                  data: response.data
              });
          }
      });
  }
}
