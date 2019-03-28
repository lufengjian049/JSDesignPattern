/**
 * 所有的异步请求等副作用
 */
import * as services from '../services';
import * as types from './types';
import {formatResourceAddInfo} from '../BLL/resourceDetail';

// import {detaildata,prdinfo,prdaddinfo} from './mockdata'
// import {Alert} from 'react-native';
//获取主接口数据
function loadData({commit,state},id) {
    if(id) {
        Promise.all([
            services.getViewSpotsInfo({spotid: id,pageid: state.pageid,}),
            services.getRelatedProducts({id: id + '',type: 0})
        ]).then(([viewinfo,productinfo]) => {
            // viewinfo = detaildata;
            // productinfo = prdinfo;
            if(!viewinfo.head || (viewinfo.head && viewinfo.head.errcode !== 0)) {
                commit(types.INITDATA_ERROR);
            }else{
                productinfo.head.errcode !== 0 && (productinfo.data = {products: []});
                const detailinfo = viewinfo.data;
                //页面类型，1:正常景点；2：免费景点；0：异常无数据
                detailinfo.pagetype = detailinfo.pfrom ? detailinfo.pfrom == '0' || detailinfo.pfrom == '1' ? 1 : 2 : 0;
                if(detailinfo.pagetype === 1) {
                    commit(types.INITDATA,{
                        viewinfo: detailinfo,
                        productinfo: productinfo.data
                    });
                }else{
                    commit(types.INITDATA_ERROR);
                }
            }
        }).catch((e) => {
            commit(types.INITDATA_ERROR);
        });
    }
}

//获取用户登录态
function getUserLogin({commit},User) {
    if(User && User.getUserInfo) {
        User.getUserInfo((result,userinfo) => {
            if(result.status === 0 && userinfo && userinfo.data) {
                commit(types.GET_USER_LOGIN_STATE,true);
            }else{
                commit(types.GET_USER_LOGIN_STATE,false);
            }
        });
    }
}

//更新秒杀信息
function updateSkill({commit},data) {
    commit(types.UPDATE_SKILL_INFO,data);
}

const addinfo = {
    normal: 'getResourceAddInfoQOC',
    box: 'getBoxAddInfoQOC',
    prd: 'getActAddInfoQOC'
};
const addinfokey = {
    normal: 'ress',
    box: 'boxs',
    prd: 'addinfos'
};

function requestAddInfo(commit,type,param,getCommitData) {
    services[addinfo[type]](param).then((response) => {
        // console.log(param,response);
        // Alert.alert('title','ddd-' + Date.now());
        // response = prdaddinfo;
        if(response.head && response.head.errcode === 0 && response.data && response.data[addinfokey[type]]) {
            // setTimeout(() => {
            commit(types['LOAD_RESS_DETAIL_' + type.toUpperCase()],getCommitData(response));
            // },20);
        }else{
            commit(types.LOAD_RESS_FAILED);
        }
    }).catch((e) => {
        // console.log(e);
        commit(types.LOAD_RESS_FAILED);
    });
}

function showLayer({commit,state},{curress,skillindex = -1,favoriteinfo = {}}) {
    commit(types.TOGGLE_LAYER,true);
    const spotinfo = state.spotinfo;
    const requestAddInfoFn = requestAddInfo.bind(null,commit);
    if(curress.isbox || (curress.boxid && curress.boxid > 0)) {
        requestAddInfoFn('box',{
            bids: [curress.boxid],
            inchina: spotinfo.inchina === void 0 ? true : spotinfo.inchina,
            viewid: spotinfo.spotid
        },(response) => {
            let redata = response.data;
            redata = (redata.boxs && redata.boxs[0] || {});
            return {
                curress,
                resourceaddinfo: redata,
                id: curress.boxid
            };
        });
    }else if(curress.isprd || (curress.pid && curress.pid > 0 && curress.options && curress.options.length > 0)) {
        requestAddInfoFn('prd',{
            optids: curress.options.map(item => item.optid),
            pid: curress.pid,
            type: 0,
        },response => ({
            curress,
            resourceaddinfo: response.data.addinfos,
            id: curress.pid
        }));
    }else{
        const param = {
            pageid: state.pageid,
            resids: [curress.resid],
            inchina: spotinfo.inchina === void 0 ? true : spotinfo.inchina,
            thingsid: curress.thingsinfo && curress.thingsinfo.thingsid || 0,
            thingspromid: curress.thingsinfo && curress.thingsinfo.thingspromid || 0,
            viewid: spotinfo.spotid,
            productId: curress.productId,
            abtests: [],
        };

        //图文详情
        const resourceParam = {
            pageid: state.pageid,
            resourceIds: [curress.resid],
        };

        Promise.all([
            services.getResourceAddInfoQOC(param),
            services.getResourceGraphicDetail(resourceParam)
        ]).then(([addinfoResponse, graphicDetailResponse]) => {
            if (addinfoResponse.head && addinfoResponse.head.errcode === 0 && addinfoResponse.data && addinfoResponse.data.ress && addinfoResponse.data.ress[0] &&
                graphicDetailResponse.head && graphicDetailResponse.head.errcode === 0 &&
                graphicDetailResponse.data) {
                const resourceGraphicDetailList = graphicDetailResponse.data.resourceGraphicDetailList || [];
                const redata = addinfoResponse.data;

                const abobj = redata.abtests.reduce((acc,item) => {
                    acc[item.testno] = item.version;
                    return acc;
                },{});

                const commitData = {
                    curress,
                    resourceaddinfo: formatResourceAddInfo(redata.ress[0]),
                    id: curress.resid,
                    skillindex,
                    extendinfo: {
                        //ab
                        //favorite
                        ...abobj,
                        ...favoriteinfo
                    },
                    resourceGraphicDetailList
                };

                commit(types.LOAD_RESS_DETAIL_NORMAL,commitData);
            } else {
                commit(types.LOAD_RESS_FAILED);
            }
        }).catch((e) => {
            commit(types.LOAD_RESS_FAILED);
        });
    }
}


function hideLayer({commit}) {
    commit(types.TOGGLE_LAYER,false);
}

function showPolicyLayer({commit},layerdata) {
    commit(types.SHOW_POLICY_LAYER,layerdata);
}

export default {
    loadData,
    updateSkill,
    showLayer,
    hideLayer,
    getUserLogin,
    showPolicyLayer
};
