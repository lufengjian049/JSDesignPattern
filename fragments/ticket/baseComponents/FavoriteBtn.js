/**
 * 收藏按钮(景点收藏/资源收藏)
 * lufj@ctrip.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Toast} from '@ctrip/crn';
import {myFavoriteCancel,myFavoriteAdd} from '../services';

export default class FavoriteBtn extends React.Component {
    static propTypes = {
        favoriteSuccessCallback: PropTypes.func,
        favoriteFailedCallback: PropTypes.func,
        logFavoriteAction: PropTypes.func,
        checkLogin: PropTypes.func,
        favoriteinfo: PropTypes.object,
        updateicon: PropTypes.bool,
        favorite: PropTypes.bool,
    }
    constructor(props) {
        super(props);
        this.state = {
            favorite: this.props.favorite,
            ...this.props.favoriteinfo
        };
        this.favoriteHandle = this.favoriteHandle.bind(this);
        this._favoriteHandle = this._favoriteHandle.bind(this);
        this.ischecking = false;
    }
    componentWillReceiveProps(nextPorps) {
        if(nextPorps.favorite !== this.props.favorite || nextPorps.favoriteinfo.favoriteData !== this.props.favoriteinfo.favoriteData) {
            this.setState({
                favorite: nextPorps.favorite,
                ...nextPorps.favoriteinfo
            });
        }
    }
    shouldComponentUpdate(nextPorps,nextState) {
        if(nextPorps.updateicon !== this.props.updateicon || this.state.favorite !== nextState.favorite) {
            return true;
        }
        if(nextPorps.favorite === this.props.favorite) {
            return false;
        }
        return true;
    }
    render() {
        return this.props.children(this.state.favorite,this.favoriteHandle);
    }
    _favoriteHandle(data,callback) {
        this.ischecking = true;
        const tofavorite = !this.state.favorite;
        //添加收藏
        if(tofavorite) {
            myFavoriteAdd({
                Channel: 3,
                FavoriteList: this.state.favoriteData
            }).then((response) => {
                if(response.ResultCode === 0 && response.FavoriteIdList && response.FavoriteIdList.length) {
                    //收藏成功
                    const fid = response.FavoriteIdList[0];
                    this.setState({
                        favorite: true,
                        favoriteId: fid
                    },() => {
                        this.ischecking = false;
                        // Toast.show('收藏成功');
                        this.props.favoriteSuccessCallback && this.props.favoriteSuccessCallback(data);
                        // event.trigger('favoritetip_show',data);
                        // this.props.isMainSpot && event.trigger('ListFavoriteChangeFromDetail',{
                        //     favorited: true
                        // });
                        callback && callback(fid);
                    });
                }else{
                    this.ischecking = false;
                    Toast.show('收藏失败，请稍后再试');
                }
            });
        }else{
            myFavoriteCancel({
                FavoriteIdList: [this.state.favoriteId]
            }).then((response) => {
                if(response.ResultCode === 0 && response.DeletedList && response.DeletedList.length) {
                    //取消成功
                    this.setState({
                        favorite: false,
                        favoriteId: 0,
                    },() => {
                        this.ischecking = false;
                        Toast.show('已取消收藏');
                        // this.props.isMainSpot && event.trigger('ListFavoriteChangeFromDetail',{
                        //     favorited: false
                        // });
                        callback && callback();
                        this.props.favoriteFailedCallback && this.props.favoriteFailedCallback();
                        // event.trigger('favoritetip_hide');
                    });
                }else {
                    this.ischecking = false;
                    Toast.show('取消收藏失败，请稍后再试');
                }
            });
        }
        // this.props.isMainSpot && detailAction.logTraceFavorite();
    }
    favoriteHandle(data = {},callback) {
        data = !data ? {} : data;
        if(this.ischecking) {
            return;
        }
        this.ischecking = true;
        // this.props.isMainSpot ? detailAction.logCodeFavotiteBtn() : detailAction.logCodeResDetailFavotiteBtn(data.resid);
        this.props.logFavoriteAction();
        // detailAction.userLogin(() => {
        //     this._favoriteHandle(data,callback);
        // },() => {
        //     this.ischecking = false;
        // });
        this.props.checkLogin(() => {
            this._favoriteHandle(data,callback);
        },() => {
            this.ischecking = false;
        });
    }
}
