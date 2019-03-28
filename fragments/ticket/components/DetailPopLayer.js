/**
 * fade poplayer类型
 */
import React from 'react';
import {View} from 'react-native';
import PopLayer from '../../baseComponents/PopLayer';
import {Inject} from '../../base/actor-react';
import LayerStore from '../../stores/layer.store';
import RoadCard from './RoadCard';

const config = {
    // normal: ({closeAction}) => (
    //     <View style={{flex: 1,justifyContent: 'center',alignItems: 'center'}}>
    //         <View style={{width: 240,height: 180,backgroundColor: '#fff',}}>
    //             <Text onPress={closeAction}>test</Text>
    //         </View>
    //     </View>
    // ),
    vertical: RoadCard
};

class DetailPopLayer extends React.Component {
    render() {
        const LayerChild = this.props.children || config[this.props.type] || View;
        const {data,children,...others} = this.props;
        return (
            <PopLayer
                {...others}
            >
                <LayerChild {...data} />
            </PopLayer>
        );
    }
}
export default Inject(LayerStore)(DetailPopLayer);
