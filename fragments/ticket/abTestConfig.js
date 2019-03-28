/**
 * abtest 配置文件
 * ab分 模块版本/数据版本
 * lufj@ctrip.com
 */

/**
 * 景点详情页-景点相关信息优化项目AB测试---已下线，全量B；
 * 实验号： 180108_vat_jdxxy
 * 版本说明:
 *  A：默认版本，盛放多余流量 (老版本)
 *  B：新版1：景点详情页调整景点信息的展示 (最完整新版)
 *  CD：对照组：景点详情页维持现状 (老版本)
 *  E：新版2：景点详情页调整景点信息的展示，但不新增“景点特色区 (新版)
 *  F：新版3：景点详情页调整景点信息的展示，但去掉景点特色区的“产品经理推荐” (新版)
 */

/**
  * 门票价格统一
  * 试验号：180419_vat_qjljb
  * 版本说明：
  * A：保留版本，盛放多余流量
    B：新版：立减不计入起价
    CD：AA对照版本
  */

/**
 * 景区接攻略视频
 * 实验号：180426_vat_jqvcr
 * 版本说明：
 * A：保留版本，盛放多余流量
   B：新版本接入视频
   CD：旧版AA对照
 */

/**
 * 国内代理门票开通售前IM功能AB测试
 * 实验号：180829_vat_gmdlp(新,2018-8-29)  180614_vat_mpdim(旧)
 * 版本说明：
 * A：默认版本盛放多余流量
   B：新版本:页面增加自助咨询
   CD：旧版AA对照
 */

/**
 * 门票提前预订期标签调整
 * 实验号:180710_vat_mpbqt
 * 版本说明:
 * A：默认版本盛放多余流量
   B：新版本
   CD：旧版AA对照(标签同旧)
 */

/**
  * 门票景点信息展示调整
  * 实验号:180824_vat_jdxxz
  * 版本说明:
  * A：默认版本盛放多余流量
    B：新版本:景点信息调整（最完整）
    CD：旧版AA对照
    E：新版本:不添加交通信息
    F：新版本:不添加服务设施&交通信息
    G：新版本:不添加榜单&服务设施&交通信息
    H：新版本:不添加游玩项目&榜单&服务设施&交通信息
  */

/**
 * 多优惠共享可用券标签计入起价对比测试
 * 实验号:180911_vat_dybqt
 * 版本说明:
 * A：默认版本盛放多余流量
   B：新版本:起价+优惠券标签展示在起价说明处(方案1)
   CD：旧版AA对照
   E：优惠价+起价说明+优惠标签在资源名称下方(方案2)
 */
export const DETAIL_ONLINESERVICE = '180829_vat_gmdlp';
export const DETAIL_RESS_TAG = '180710_vat_mpbqt';
export const DETAIL_HEADER_INFO = '180824_vat_jdxxz';
export const DETAIL_DISCOUNT = '180911_vat_dybqt';
class ClearableWeakMap {
    constructor(init) {
        this._wm = new WeakMap(init);
    }
    clear() {
        this._wm = new WeakMap();
    }
    delete(k) {
        return this._wm.delete(k);
    }
    get(k) {
        return this._wm.get(k);
    }
    has(k) {
        return this._wm.has(k);
    }
    set(k, v) {
        this._wm.set(k, v);
        return this;
    }
}
let _instance = null;
class ABTestConfig {
    constructor() {
        //ultimateVersion: 'B',//ab测试，最终的版本，等接口ab下线后，该字段的优先级最高，未下线时，该字段不可赋值！！
        this.config = {
            [DETAIL_ONLINESERVICE]: {
                version: 'A',
                new: 'B',
                old: ['A','C','D']
            },
            [DETAIL_RESS_TAG]: {
                version: 'A',
                new: ['B'],
                old: ['A','C','D']
            },
            [DETAIL_HEADER_INFO]: {
                version: 'A',
                new: ['B','E','F','G','H'],
                old: ['A','C','D']
            },
            [DETAIL_DISCOUNT]: {
                version: 'A',
                new: ['B','E'],
                old: ['A','C','D']
            }
        };
        this.testno = 'testno';
        this.version = 'version';
        this.cacheMap = new ClearableWeakMap();
    }
    static getInstance() {
        _instance = _instance || new ABTestConfig();
        return _instance;
    }
    checkIsDefaultVersion(theno) {
        return this.getConfig(theno).isDefaultVersion;
    }
    setAbtestFields(testno,version) {
        testno && (this.testno = testno);
        version && (this.version = version);
    }
    //根据 目前在前端做ab的实验号，初始化当前实验号的版本信息
    setVersionsFromAbtests(abtests) {
        abtests && abtests.length && abtests.forEach((abitem) => {
            this.setVersionToTheNo(abitem[this.testno],abitem[this.version]);
        });
    }
    getConfig(theno) {
        return theno && this.config[theno] || null;
    }
    getVersionByTheNo(theno) {
        const curconfig = this.getConfig(theno);
        if(curconfig) {
            return curconfig.ultimateVersion || curconfig.version;
        }
        return '';
    }
    setVersionToTheNo(theno,version) {
        let curconfig = this.getConfig(theno);
        if(curconfig && version) {
            curconfig = {
                ...curconfig,
                version,
                isDefaultVersion: false,
            };
            this.config[theno] = curconfig;
        }
    }
    //old: true ; new: false
    checkCurrVersionIsOldOrNew(theno) {
        const curconfig = this.getConfig(theno);
        if(this.cacheMap.has(curconfig)) {
            return this.cacheMap.get(curconfig);
        }
        const version = this.getVersionByTheNo(theno);
        if(~curconfig.old.indexOf(version)) {
            this.cacheMap.set(curconfig,true);
            return true;
        }
        if(~curconfig.new.indexOf(version)) {
            this.cacheMap.set(curconfig,false);
            return false;
        }
    }
}
export default ABTestConfig.getInstance();
