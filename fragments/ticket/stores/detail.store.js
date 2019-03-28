/**
 * 详情页主接口数据store
 */
import {Store,ActionCreator} from '../base/actor';
import * as services from '../services';
import {mappedRess} from '../reducers';
import HeaderStore,{InitHeaderStore,UpdateHeaderFlowData} from './detail/header.store';
import CommonStore,{InitCommonData} from './detail/common.store';
import HeaderTop,{UpdateImgs,UpdateSpotFavorite} from './detail/headertop.store';
import ChildSpotStore,{InitChildSpotList} from './detail/childspot.store';

export const InitPageData = ActionCreator('InitPageData');
//初始化阶段！！
//分 headerstore,
//分模块store
export default class DetailStore extends Store {
    state = {
        renderPageLoading: true,
        loadFailed: false,
    }
    path = 'root/DetailStore/'
    createReceive() {
        return this.receiveBuilder()
            .match(InitPageData,async (initPageData) => {
                const {
                    spotid,cityid,pageid,push
                } = initPageData.data;
                Promise.all([
                    services.getViewSpotsInfo({
                        spotid: spotid,pageid: pageid,imgsize: 'C_750_380',cityId: cityid
                    }),
                    services.getRelatedProducts({id: spotid,type: 0}),
                ]).then(([viewinfo,productinfo]) => {
                    if(!viewinfo.head || viewinfo.head.errcode !== 0) {
                        this.errorCallback();
                    }else{
                        productinfo.head.errcode !== 0 && (productinfo.data = {products: []});
                        const detailinfo = viewinfo.data;
                        //页面类型，1:正常景点；2：免费景点；0：异常无数据
                        detailinfo.pagetype = detailinfo.pfrom ? detailinfo.pfrom == '0' || detailinfo.pfrom == '1' ? 1 : 2 : 0;
                        if(detailinfo.pagetype === 0) {
                            this.errorCallback();
                        }
                        //预处理接口的一些数据
                        const {
                            ressHash, skilllist, hasress, spotinfo
                        } = mappedRess(detailinfo,{
                            isNewDiscount: true,
                            version: 'B'
                        });

                        //将数据分store存储
                        //common
                        this.context.system.broadcast(new InitCommonData({
                            push,
                            spotinfo,
                            pageid
                        }),1,this.path);
                        //header
                        this.context.system.broadcast(new InitHeaderStore({
                            spotinfo,
                            version: 'B'
                        }),1,this.path);
                        //获取异步数据
                        this.fetchSpotImgs();
                        this.fetchFlowData(viewinfo.data.haspassflow && viewinfo.data.spotstatus === 2 , detailinfo.pagetype);
                        this.fetchIsMyFaorite(viewinfo.data.gscid);
                        this.fetchChildSpots(viewinfo.data.isactivesearch);
                        //名称区域的数据 --- 有渲染任务 fiber 就会开始渲染!!!
                        //TODO:
                        this.setState({
                            headerinfo: {
                                name: spotinfo.spotname,
                                imgcount: spotinfo.imgurls.length || 0,
                                isinit: false,
                                imgs: spotinfo.imgurls.map(url => ({ url})),
                            },
                            renderPageLoading: false,
                            ticketinfo: spotinfo.ticketinfo,
                        });
                    }
                });
            })
            .build();
    }
    errorCallback() {
        this.setState({
            loadFailed: true,
            renderPageLoading: false
        });
    }
    // fetchSHXData() {
    //     const ins = this.context.actorOf();
    //     ins.tell();
    // }
    getCommonState() {
        return this.context.child(CommonStore).getInstance().state;
    }
    getHeaderState() {
        return this.context.child(HeaderStore).getInstance().state;
    }
    //获取客流信息
    fetchFlowData(hasflow, pagetype) {
        if (hasflow) {
            const {spotid,pageid} = this.getCommonState();
            services.getSpotFlow({
                id: spotid,
                pageid: pageid
            }).then((response) => {
                if (pagetype === 2) { // 免费景点
                    //TODO:
                    // this.store.dispatch(actions.updateFlowDataFree(response.data || {parkstatus: ''}));
                } else { // 普通景点
                    this.context.system.broadcast(new UpdateHeaderFlowData(response.data || {parkstatus: ''}),1,this.path);
                }
            });
        }
    }
    //获取图片列表
    fetchSpotImgs() {
        const {spotid,pageid} = this.getCommonState();
        services.getSpotImages({
            id: spotid,
            imagesizes: ['C_320_180', 'C_750_380'],
            pageid: pageid
        }).then((response) => {
            if (response.head.errcode === 0) {
                const resimgs = response.data.imgs || [];
                if(resimgs.length > 0) {
                    this.context.system.broadcast(new UpdateImgs({
                        imgs: resimgs,
                        videoInfos: response.data.videoInfos || []
                    }),1,this.path);
                }
            }
        });
    }
    fetchIsMyFaorite(gscid) {
        const {spotid} = this.getCommonState();
        const favoriteData = [{
            BizType: 'TICKET',//TICKET_RESOURCE
            ProductType: '',
            ProductID: spotid,//资源id
            FromCityID: gscid || 2
        }];
        services.isMyFavorite({
            QueryList: favoriteData
        }).then((response) => {
            if(response.ResultCode === 0) {
                const favoriteId = response.ResultList && response.ResultList[0] && response.ResultList[0].FavoriteID || 0;
                this.context.system.broadcast(new UpdateSpotFavorite({
                    favorite: !!favoriteId,favoriteData,favoriteId
                }),1,this.path);
            }
        });
    }
    fetchChildSpots(isactivesearch) {
        const {spotid,pageid} = this.getCommonState();
        const {spotplay} = this.getHeaderState();
        if(!isactivesearch || spotplay.show) {
            return;
        }
        services.getChildSpotList({
            imgsize: 'C_348_236',
            viewspotid: spotid,
            pageid: pageid
        }).then((response) => {
            if (response.head.errcode === 0) {
                this.context.system.broadcast(new InitChildSpotList(response.data),1,this.path);
            }
        });
    }
    //获取 是否收藏
    preStart() {
        //动态挂载...动态监听 需要同一个实例
        //挂载 子actor
        //将store的实例 再动态的挂到全局去
        this.context.actorOf(HeaderTop);
        this.context.actorOf(HeaderStore);
        this.context.actorOf(CommonStore);
        this.context.actorOf(ChildSpotStore);
    }
}
