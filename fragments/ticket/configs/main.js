/**
 * 主售卖景点的配置
 */
import ProductRecommend from '../components/ProductRecommend';
import DetailStore from '../stores/detail.store';

//配置化组件 绑定一个数据流
//有数据流进，就进行页面的渲染，从而控制stream
//stream -> component
//data ready
const config = [
    {
        Component: ProductRecommend,
        mapDataToProps: () => {

        },
        state: DetailStore,
    }
];

