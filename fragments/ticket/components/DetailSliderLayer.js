/**
 * 购买须知浮层 | 领取优惠券浮层 | 优待政策浮层 | 通知公告浮层
 * lufj@ctrip.com
 */
import React from 'react';
import {View} from 'react-native';
import connectStateDecorator,{withStateWrapper} from 'connectStateDecorator';
import {BuyerReading} from '@ttd/ttd-spot-detail';
import SliderPopLayer from '../../baseComponents/SliderPopLayer';
import ResDetailFooter from './ResDetailFooter';
import detailAction from '../../detail.action';
import CouponChoose from './CouponChoose';
import PoliciesLayer from './PoliciesLayer';
import NoticeLayer from './NoticeLayer';
import {Inject} from '../../base/actor-react';
import DialogStore from '../../stores/dialog.store';

const config = {
    coupon: connectStateDecorator('couponinfo')(withStateWrapper(CouponChoose)),
    resdetail: BuyerReading,
    policies: PoliciesLayer,
    notify: NoticeLayer
    // notify: connectStateDecorator('noticeInfo')(withStateWrapper(NoticeLayer))
};
class DetailSliderLayer extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.headerEventHandle = this.headerEventHandle.bind(this);
    // }
    // componentDidCatch(error) {
    //     // this.setState({
    //     //     error
    //     // });
    //     console.log(error.toString());
    // }
    render() {
        let LayerChild = View;
        if(this.props.show) {
            LayerChild = config[this.props.mode];
        }
        const {data,mode,...others} = this.props;
        return (
            <SliderPopLayer
                ref={ref => this.sliderlayer = ref}
                {...others}
                footer={mode === 'resdetail' ? ResDetailFooter : null}
                hideHeader={mode !== 'coupon'}
                action={detailAction}
                canDrag={mode !== 'coupon'}
            >
                <LayerChild {...data} />
            </SliderPopLayer>
        );
    }
    // multiNextPage(options) {
    //     this.sliderlayer && this.sliderlayer.multiNextPage(options);
    // }
}
export default Inject(DialogStore)(DetailSliderLayer);
