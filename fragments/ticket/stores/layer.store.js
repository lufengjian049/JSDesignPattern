/**
 * 区别于dialog.store 的功能，因为会有同时出现的情况，所以需要分开存储状态
 * 该store主要用于Fade类型的浮层
 */
import {Store,ActionCreator} from '../base/actor';
import {getRoadCardInfo} from '../services';
import CommonStore from './detail/common.store';

export const NormalLayerShow = ActionCreator('NormalLayerShow');

export const RoadCardLayerShow = ActionCreator('RoadCardLayerShow');

export const SwitchRoadCardLayer = ActionCreator('SwitchRoadCardLayer');

export const LayerHide = ActionCreator('LayerHide');

const initState = {
    show: false,
    isloading: false,
    type: '',//vertical normal
    data: {}
};
export default class LayerStore extends Store {
  state = initState
  createReceive() {
      return this.receiveBuilder()
          .match(NormalLayerShow,({data}) => {
              this.setState({
                  type: 'normal',
                  show: true,
                  ...this.getAddonProps(data),
                  data
              });
          })
          .match(RoadCardLayerShow,({data}) => {
              this.setState({
                  show: true,
                  isloading: true,
                  type: 'vertical',
                  ...this.getAddonProps(data),
                  injectProps: {
                      switchRoadCard: () => {
                          this.context.system.broadcast(new SwitchRoadCardLayer(),1);
                      }
                  }
              });
              this.fetchRoadCard();
          })
          .match(SwitchRoadCardLayer,() => {
              this.setState({
                  data: this.getRoadCardInfo({
                      ...this.state.data.result,
                      currentSelectCard: this.state.data.selectCard
                  })
              });
          })
          .match(LayerHide,() => {
              this.setState(initState);
          })
          .build();
  }
  getAddonProps(data) {
      return {
          hide: this.hideLayer.bind(this),
          showCallback: data && data.showCallback || null,
          hideCallback: data && data.hideCallback || null,
      };
  }
  hideLayer() {
      this.context.system.broadcast(new LayerHide(),1);
  }
  getCommonState() {
      return this.context.parent().getContext().get(CommonStore).getInstance().state;
  }
  fetchRoadCard() {
      const {pageid,spotid,imgurls} = this.getCommonState();
      getRoadCardInfo({
          pageid: pageid,
          viewspotid: spotid
      }).then((response) => {
          if (response.head.errcode === 0) {
              const redata = response.data;
              const imgurl = imgurls && imgurls[0] || redata.defaultimgurl;
              const data = this.getRoadCardInfo(redata);
              if(data) {
                  this.setState({
                      data,
                      isloading: false,
                      backImageSource: imgurl
                  });
              }else{
                  this.hideLayer();
              }
          }
      });
  }
  getRoadCardInfo(data) {
      let selectCard, switchContent;
      const {roadcards: roadCards,hasswitchbtn,currentSelectCard} = data;
      // 有问路卡数组
      if(currentSelectCard) {
          selectCard = roadCards.find(card => (card.type === (currentSelectCard.type === 'en' ? 'local' : 'en')));
      }else if (roadCards.length) {
          selectCard = roadCards.find(card => card.type === 'local');
          if (!selectCard) {
              selectCard = roadCards.find(card => card.type === 'en');
          }
      }

      if (selectCard) {
          if (hasswitchbtn) {
              switchContent = selectCard.type === 'en' ? '切换为当地语言' : '切换为英语';
          }
          return {
              result: data,
              hasswitchbtn: hasswitchbtn,
              selectCard: selectCard,
              switchContent: switchContent, // 切换按钮文案
          };
      }
      return null;
  }
}
