/**
 * 头部图片区域的数据
 */
import {Store,ActionCreator} from '../../base/actor';

export const UpdateImgs = ActionCreator('UpdateImgs');

export const UpdateSpotFavorite = ActionCreator('UpdateSpotFavorite');

export const UpdateIconType = ActionCreator('UpdateIconType');

export default class HeaderTopStore extends Store {
    state = {
        spotimg: {},
        favorite: {},
        icontype: 0
    }
    createReceive() {
        return this.receiveBuilder()
            .match(UpdateImgs,(imgdata) => {
                const imgs = this.mappedImgs(imgdata.data.imgs);
                this.setState({
                    spotimg: {
                        imgs,
                        imgcount: imgs.length > 999 ? '999+' : imgs.length,
                        hasvideo: !!imgdata.data.videoInfos.length,
                        videoInfos: imgdata.data.videoInfos
                    }
                });
            })
            .match(UpdateSpotFavorite,(spotfavorite) => {
                this.setState({
                    favorite: spotfavorite.data
                });
            })
            .match(UpdateIconType,(icontype) => {
                this.setState({
                    icontype: icontype.data
                });
            });
    }
    mappedImgs(imgs) {
        const obj = {
            imageUrl: '',
            imageThumbnailUrl: '',
            category: '',
            imageTitle: '',
            imageDescription: ''
        };
        return imgs.map((img) => {
            if (typeof img === 'string') {
                return {
                    url: img
                };
            }
            const {imgsizes,...other} = img;
            const imgsizeinfo = imgsizes || [];

            for (let j = 0; j < imgsizeinfo.length; j++) {
                if (String(imgsizeinfo[j].size) === 'C_320_180') {
                    obj.imageThumbnailUrl = imgsizeinfo[j].url;
                }
                if (String(imgsizeinfo[j].size) === 'C_750_380') {
                    obj.imageUrl = imgsizeinfo[j].url;
                    obj.url = imgsizeinfo[j].url;
                }
            }
            // const filteredimg = img.imgsizeinfos && img.imgsizeinfos.filter(imginfo => imginfo.imgsize === imgsize) || [{}];
            return {
                url: '',
                ...obj,
                ...other,
            };
        });
    }
}
