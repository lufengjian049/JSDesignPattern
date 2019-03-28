/**
 * 处理数据逻辑
 */
import * as types from './types';
import DataConvert from '../DataConvert';
import * as resourceDetail from '../BLL/resourceDetail';
import {event} from './Event';
import DetailAction from '../detail.action';

const detailAction = DetailAction.getInstance();

const mutations = {
    [types.INITDATA](state,data) {
        const {viewinfo,productinfo} = data;
        const abtest = {
            '180419_vat_qjljb': 'A',
        };
        viewinfo.abtests.forEach((item) => {
            if(item.testno in abtest) {
                abtest[item.testno] = item.version;
            }
        });
        // const priceabIsNew = abtest['180419_vat_qjljb'] === 'B';
        const { ressHash, skilllist, spotinfo } = DataConvert.mappedRess(viewinfo,true);
        const productlist = DataConvert.mappedProducts(productinfo);
        const shelfgroupinfo = viewinfo.shelfgroupinfo;
        state.loading = false;
        state.recommends = {
            name: shelfgroupinfo && shelfgroupinfo.recommend && shelfgroupinfo.recommend.name || '携程推荐',
            list: DataConvert.getRecommends(viewinfo, skilllist, ressHash).recommendlist.concat(productlist),
            timestamp: Date.now(),
        };
        state.skills = {
            list: skilllist,
            timestamp: Date.now()
        };
        state.spotinfo = {
            spotid: spotinfo.spotid,
            inchina: spotinfo.inchina,
            spotname: spotinfo.spotname,
            utcoffset: spotinfo.utcoffset,
            abtests: spotinfo.abtests,
            isdomestic: spotinfo.isdomestic,
            destcityids: spotinfo.destcityids,
        };
        state.shelfinfo = DataConvert.mapShelfInfo(shelfgroupinfo, ressHash,ress => ress,{
            isNewDiscount: false,
            filterPeopleProperty: spotinfo.filterPeopleProperty || ['chengrp']
        });//多优惠根据ab结果来
        // state.onlineservice = DataConvert.getOnlineServiceData(viewinfo);
    },
    [types.INITDATA_ERROR](state) {
        state.error = true;
        state.loading = false;
    },
    [types.GET_USER_LOGIN_STATE](state,islogin) {
        state.islogin = islogin;
    },
    [types.UPDATE_SKILL_INFO](state,data) {
        const {list,skillid} = DataConvert.updateSkillInfo2(data.skilllist,data.updateData, data.currentTime);
        state.skills = {
            ...state.skills,
            list,
            timestamp: Date.now()
        };
        //注意：此处是同步更新 浮层的 抢购按钮
        if(state.layer && state.layer.id && ~skillid.indexOf(state.layer.id)) {
            state.layer = {
                ...state.layer,
                timestamp: Date.now(),
                footinfo: {
                    ...state.layer.footinfo,
                    curress: state.skills.list[state.layer.skillindex]
                }
            };
        }
    },
    [types.TOGGLE_LAYER](state,show) {
        state.layer = {
            show,
            loading: !!show,
            timestamp: Date.now(),
            error: '',
            model: '',
        };
    },
    [types.LOAD_RESS_FAILED](state) {
        state.layer = {
            timestamp: Date.now(),
            loading: false,
            show: false,
            error: '网络出错，请稍后重试'
        };
    },
    [types.LOAD_RESS_DETAIL_NORMAL](state,data) {
        const layerHandle = resourceDetail.resDetailPublicHandle(state.spotinfo,data.curress,data.skillindex > -1,false);
        const ressinfo = {
            type: 'normal',
            ...layerHandle(data.resourceaddinfo),
        };
        const addInfo = resourceDetail.aggregationAddInfo(data.resourceaddinfo);
        const resourceGraphic = data.resourceGraphicDetailList;
        state.layer = {
            ...state.layer,
            error: '',
            loading: false,
            id: data.id,
            skillindex: data.skillindex,
            timestamp: Date.now(),
            contentinfo: resourceDetail.getLayerContent({
                ressinfo,
                addInfo,
                resourceGraphic,
                descdetails: data.resourceaddinfo.descdetails,
                jumpActions: {
                    commonHandle: () => {
                        event.trigger('favoritetip_hide');
                    }
                },
                fromTTD: false,
            },detailAction),
            // footinfo: DataConvert.getLayerFootinfo(data.curress,ressinfo,state.spotinfo),
            footinfo: resourceDetail.getLayerFooter(state.spotinfo,data.curress,ressinfo,data.extendinfo),
        };
    },
    [types.LOAD_RESS_DETAIL_BOX](state,{curress,resourceaddinfo,id}) {
        const layerHandle = resourceDetail.resDetailPublicHandle(state.spotinfo,curress,false,false);
        const ressinfo = {
            type: 'box',
            isretcash: false,
            issday: curress.issday,
            isbox: true,
            ...layerHandle(resourceaddinfo),
        };
        const addInfo = resourceDetail.aggregationAddInfo(resourceaddinfo);
        state.layer = {
            ...state.layer,
            error: '',
            loading: false,
            id,
            timestamp: Date.now(),
            contentinfo: resourceDetail.getLayerContent({
                ressinfo,
                addInfo,
                descdetails: resourceaddinfo.descdetails,
                jumpActions: {
                    commonHandle: () => {
                        event.trigger('favoritetip_hide');
                    }
                },
                fromTTD: false,
            }),
            footinfo: resourceDetail.getLayerFooter(state.spotinfo,curress,ressinfo,{}),
            // footinfo: DataConvert.getLayerFootinfo(curress,ressinfo,state.spotinfo)
        };
    },
    [types.LOAD_RESS_DETAIL_PRD](state,{curress,resourceaddinfo,id}) {
        resourceaddinfo.forEach((v) => {
            v.stcode = v.stcode || v.subtcode;
            let newrinfos = v.desclist.slice();
            if (v.stcode == '13') { // 13 是老版本（dev7.8.2之前）的二级 的使用方法
                newrinfos = [];
                v.desclist.forEach((ditem) => {
                    if (ditem.destype == 2) {
                        newrinfos.push({
                            destype: 2,
                            desc: '快速入园'
                        });
                        ditem.destype = 0;
                    }
                    newrinfos.push(ditem);
                });
            }
            if (v.stcode == '74' && v.tags && v.tags.length) { // 74 是老的二级的退改规则
                newrinfos.splice(0, 0, {
                    destype: 2,
                    desc: '随时退'
                });
            }
            v.desclist = newrinfos;
        });
        const ressinfo = {
            type: 'act',
            name: curress.name,
            abtime: curress.abtime,
            abdays: curress.abdays,
            aotime: curress.aotime,
            aomsage: curress.aomsage
        };
        state.layer = {
            ...state.layer,
            error: '',
            loading: false,
            id,
            timestamp: Date.now(),
            contentinfo: {
                ressinfo,
                addInfo: resourceaddinfo,
                descdetails: []
            },
            footinfo: resourceDetail.getLayerFooter(state.spotinfo,curress,ressinfo,{}),
            // footinfo: DataConvert.getLayerFootinfo(curress,ressinfo,state.spotinfo)
        };
    },
    [types.SHOW_POLICY_LAYER](state,layerdata) {
        state.layer = {
            ...state.layer,
            show: true,
            loading: false,
            timestamp: Date.now(),
            error: '',
            contentinfo: layerdata,
            model: 'policy',
        };
    }
};
export default mutations;
