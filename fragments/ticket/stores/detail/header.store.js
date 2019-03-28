/**
 * 头部信息数据集合
 */
import {Store,ActionCreator} from '../../base/actor';
import {trimBR} from '../../baseComponents/util';

const FLOW_DESC = {
    A: ['舒适','#88db1d'],
    B: ['较舒适','#ffce09'],
    C: ['一般','#ff8a00'],
    D: ['拥挤','#f85a5a'],
    default: ['','']
};

export const InitHeaderStore = ActionCreator('InitHeaderStore');

export const UpdateHeaderFlowData = ActionCreator('UpdateHeaderFlowData');

export default class HeaderStore extends Store {
    createReceive() {
        return this.receiveBuilder()
            .match(InitHeaderStore,(initstore) => {
                //处理处头部的数据
                const {spotinfo,version} = initstore.data;
                this.setState(this.getHeaderInfo(spotinfo,{version}));
            })
            .match(UpdateHeaderFlowData,(flowdata) => {
                const spotflow = this.mapSpotFlowInfo(flowdata.data);
                this.setState({
                    spotparkinfo: {
                        ...this.state.spotparkinfo,
                        opentime: {
                            ...this.state.spotparkinfo.opentime,
                            flowDesc: spotflow.flowDesc,
                            descolor: spotflow.descolor,
                        }
                    }
                });
            });
    }
    getHeaderInfo(spotinfo,{version}) {
        const baseData = {show: false};
        //-----景点介绍模块
        //景点主题 -- 展示景区后台配置的排序第一的{主题标签}，无则不展
        const theme = spotinfo.extra.themes && spotinfo.extra.themes[0];
        //所属景区
        const mainSpot = {
            mainSpotId: spotinfo.mainSpotId,
            mainSpotName: spotinfo.mainSpotName,
        };
        let recommendinfo = '';
        let tags = [];
        const playItem = (spotinfo.playItems || [])[0];
        const showItem = (spotinfo.showItems || [])[0];
        //免费景点没有如下信息
        if(spotinfo.pagetype === 1) {
        //产品经理推荐
            recommendinfo = spotinfo.painfos['8'] && spotinfo.painfos['8'].desclist[0];
            recommendinfo = recommendinfo && recommendinfo.desc.replace(/[\r|\n]$/,'') || '';
            //景点标签-景区级别,特色标签,游玩项目,人群标签
            tags = (spotinfo.painfos['222'] && spotinfo.painfos['222'].desclist || []).filter(item => item.destype === 1).slice(0,1);
            spotinfo.star && tags.unshift({desc: `${spotinfo.star}A景区`});
            //--游玩项目：展示景点下第一个有效的游玩项目/演出的名称，优先级：游玩项目>演出，无则不展；
            (playItem || showItem) && tags.push({desc: playItem ? playItem.name : showItem.name});
            spotinfo.extra.crowdLabels && spotinfo.extra.crowdLabels.length && tags.push({desc: spotinfo.extra.crowdLabels[0]});
        }
        //榜单信息 >= G || > F 不显示榜单
        // const spottop = {
        //     ...baseData,
        // };
        // if(version < 'G') {
        //     spottop.show = !!spotinfo.topName;
        //     spottop.topname = (spotinfo.topDistrictName ? spotinfo.topDistrictName + '必体验：' : '') + spotinfo.topName;
        //     spottop.topnum = spotinfo.topRank;
        //     spottop.url = spotinfo.topUrl;
        // }
        //-----游玩内容模块
        const spotplay = {
            ...baseData,
        };
        //是否显示主子景点模块
        let showChildSpotList = true;
        spotplay.showChild = spotinfo.pagetype === 1;
        if(version < 'H') {
            spotplay.show = !!(playItem || showItem);
            showChildSpotList = !spotplay.show;
            spotplay.list = [];
            playItem && spotplay.list.push({
                type: 'play',
                playType: 1,
                title: '玩项目',
                num: spotinfo.playItems.length,
                desc: spotinfo.playItemsDesc || (spotinfo.playItems || []).map(item => item.name).join('、')
            });
            showItem && spotplay.list.push({
                type: 'performance',
                playType: 2,
                title: '看演出',
                num: spotinfo.showItems.length,
                desc: spotinfo.showItemsDesc || (spotinfo.showItems || []).map(item => item.name).join('、')
            });
            spotplay.routes = (spotinfo.routes || []).map(item => item.name);
        }
        //-----入园信息模块
        //1.景区公告
        //开放时间 优待政策 服务设施
        //免费景点没有该模块
        let spotparkinfo = {
            ...baseData
        };
        if(spotinfo.pagetype === 1) {
            let spotServices = [];
            if(version < 'F') {
                spotServices = spotinfo.servicedesc && spotinfo.servicedesc.complexservice || [];
            }
            const hasdesc = spotinfo.todayStatusDesc && spotinfo.todayOpenTime;
            const spotstatusdesc = hasdesc ? [spotinfo.todayStatusDesc,spotinfo.todayOpenTime].join(' ') : (spotinfo.todayStatusDesc || spotinfo.todayOpenTime || '');
            const policystr = spotinfo.painfos['16'] && trimBR(spotinfo.painfos['16'].desclist.map(item => item.desc).join('')).substr(0,50);
            const policy = !(spotinfo.scenicSpotFree || spotinfo.hasMainTicket) && spotinfo.painfos['16'] ? ('优待政策：' + policystr) : null;
            spotparkinfo = {
                show: true,
                opentime: {
                    spotstatusdesc,
                    openTimeDescription: spotinfo.openTimeDescription ? ((spotstatusdesc ? '(' : '开放时间：') + spotinfo.openTimeDescription + (spotstatusdesc ? ')' : '')) : ''
                },
                policy,
                spotServices,
            };
            if(!spotstatusdesc && !spotinfo.openTimeDescription && !policy && !spotServices.length) {
                spotparkinfo.show = false;
            }
        }

        return {
            new: true,
            // name: spotinfo.spotname,
            // imgcount: spotinfo.imgurls.length || 0,
            theme,
            showChildSpotList,
            loadTrfficInfo: version === 'B',
            spotlabel: {
                mainSpot,
                recommendinfo,
                tags,
                show: recommendinfo || tags.length || mainSpot.mainSpotId
            },
            spotcomment: {
                cmtscore: spotinfo.cmtscore,
                cmttag: spotinfo.cmttag,
                cmtdesc: spotinfo.cmtusertotal ? `${this.getCommentDesc(spotinfo.cmtusertotal)}人点评` : ''
            },
            // spottop,
            spotplay,
            spotnotice: {
                noticetype: spotinfo.noticetype,
                noticetitle: spotinfo.noticetitle
            },
            spotparkinfo,
            spotaddress: {
                addr: spotinfo.address ? spotinfo.address.replace(/[\r|\n]$/,'') : '',
                hasroadcard: spotinfo.hasroadcard || false,
                way: version === 'B' ? spotinfo.way : '',
            }
        };
    }
    getCommentDesc(num) {
        const desc = '';
        if(num >= 0) {
            return num < 100000 ? num : ((num / 10000).toFixed(1) + 'w+');
        }
        return desc;
    }
    mapSpotFlowInfo(data) {
        let flowDesc = '',descolor = '';
        if(data.parkstatus === 'O' && data.businessopen) {
            [flowDesc,descolor] = FLOW_DESC[data.comfort || 'default'];
        }
        return {
            flowDesc,
            descolor,
        };
    }
}
