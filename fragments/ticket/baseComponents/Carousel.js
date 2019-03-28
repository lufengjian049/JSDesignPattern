/**
 * 头部轮播组件
 * lufj@ctrip.com
 */
import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableWithoutFeedback,
    Platform,
    Dimensions,
} from 'react-native';
import Label from 'Label';
import PropTypes from 'prop-types';

const isAndroid = Platform.OS !== 'ios';
const deviceWidth = Dimensions.get('window').width;

class Carousel extends Component {
    static propTypes = {
        imgs: PropTypes.arrayOf(PropTypes.object).isRequired,
        itemPressHandle: PropTypes.func,
        enablePress: PropTypes.bool,
        height: PropTypes.number.isRequired,
    }
    constructor(props) {
        super(props);
        this._onScrollHandler = this._onScrollHandler.bind(this);
        this._onScrollEndDrag = this._onScrollEndDrag.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._positions = [];
        this.curActiveItem = 0;
    }
    shouldComponentUpdate(nextProps) {
        if(nextProps.imgs.length !== this.props.imgs.length) {
            return true;
        }
        let hasChanged = false;
        nextProps.imgs.forEach((img,index) => {
            if(this.props.imgs[index].url !== img.url) {
                hasChanged = true;
            }
        });
        return hasChanged;
    }
    componentDidUpdate() {
        this._initPosition();
    }
    render() {
        return (
            <FlatList
                ref={(c) => { this._flatlist = c; }}
                showsHorizontalScrollIndicator={false}
                overScrollMode="never"
                initialNumToRender={2}
                horizontal={true}
                extraData={this.state}
                keyExtractor={(item, index) => index}
                onScroll={this._onScrollHandler}
                onScrollBeginDrag={this._onScrollBeginDrag}
                onScrollEndDrag={this._onScrollEndDrag}
                onTouchStart={this._onTouchStart}
                onTouchEnd={this._onTouchEnd}
                data={this.props.imgs}
                renderItem={({item,index}) => (
                    <SwiperItem
                        img={item.url}
                        height={this.props.height}
                        clickhandle={() => {
                            if(!this.props.enablePress) {
                                return;
                            }
                            this.props.itemPressHandle();
                        }}
                    />
                )}
                // initialScrollIndex={2}
                getItemLayout={(data, index) => ({length: deviceWidth, offset: deviceWidth * index, index})}
            />
        );
    }
    _initPosition() {
        if(this._positions.length < 2) {
            this.props.imgs.forEach((item,index) => {
                this._positions[index] = {
                    start: index * deviceWidth,
                    end: index * deviceWidth + deviceWidth
                };
            });
            this.poscount = this._positions.length;
        }
    }
    _getActiveItem(offset) {
        const center = offset + deviceWidth / 2;
        const centerOffset = 0;
        for (let i = 0; i < this._positions.length; i++) {
            const { start, end } = this._positions[i];
            if (center + centerOffset >= start && center - centerOffset <= end) {
                return i;
            }
        }
        return 0;
    }
    _onScrollHandler() {

    }
    _onScrollBeginDrag() {

    }
    _onScrollEndDrag(event) {
        if(isAndroid) {
            this._onTouchEnd(this.hackAndroidTouchEndEvent(event));
        }
        if(this.enablescroll && this.poscount) {
            const scrollOffset = (event && event.nativeEvent && event.nativeEvent.contentOffset &&
                Math.round(event.nativeEvent.contentOffset.x)) || 0;
            this.nextActiveItem = this._getActiveItem(scrollOffset);
            if(this.curActiveItem !== this.nextActiveItem) {
                this._snapToItem(this.nextActiveItem);
                if(this.nextActiveItem === this.poscount - 1) {
                    this._snapToItem(0,false);
                }
            }else{
                this._snapToItem(this.curActiveItem);
            }
        }
    }
    _onTouchStart(e) {
        this.enablescroll = true;
        this.touchstart = isAndroid ? Date.now() : e.nativeEvent.timestamp;
        this.startlocationx = e.nativeEvent.locationX;
        if(isAndroid && this.startlocationx > deviceWidth) {
            this.startlocationx -= deviceWidth * this.curActiveItem;
        }
    }
    //Android 不会触发 touchend事件。。。模拟事件的参数
    hackAndroidTouchEndEvent(scrollevent) {
        const offset = (scrollevent && scrollevent.nativeEvent && scrollevent.nativeEvent.contentOffset &&
                    Math.round(scrollevent.nativeEvent.contentOffset.x)) || 0;
        let lx = this.startlocationx;
        if(offset > deviceWidth * this.curActiveItem) {
            lx -= 15;
        }else{
            lx += 15;
        }
        const event = {
            nativeEvent: {
                timestamp: Date.now(),
                locationX: lx
            }
        };
        return event;
    }
    _onTouchEnd(e) {
        if(this.props.imgs.length === 1 || this.props.imgs.length === 0) {
            return;
        }
        const eventobj = e.nativeEvent;
        if(isAndroid && eventobj.target) {
            eventobj.timestamp = Date.now();
            if(eventobj.locationX > deviceWidth) {
                eventobj.locationX -= deviceWidth * this.curActiveItem;
                if(eventobj.locationX > this.startlocationx) {
                    eventobj.locationX += 5;
                }else{
                    eventobj.locationX -= 5;
                }
            }
            // return;
        }
        this.touchend = eventobj.timestamp;
        this.endlocationx = eventobj.locationX;
        let curindex = this.curActiveItem;
        const diff = Math.abs(this.endlocationx - this.startlocationx);
        // console.log('cha--',this.touchend - this.touchstart);
        if(this.touchend - this.touchstart < 200 && this.poscount && diff > 10) {
            this.enablescroll = false;
            if(this.endlocationx < this.startlocationx) {
                curindex += 1;
                this._snapToItem(curindex);
                if(curindex === this.poscount - 1) {
                    this._snapToItem(0,false);
                }
            }else{
                curindex -= 1;
                if(curindex >= 0) {
                    this._snapToItem(curindex);
                }
            }
        }
    }
    _snapToItem(index,animated = true) {
        this._curpos = this._positions[index] && this._positions[index].start;
        this.curActiveItem = index;
        this._flatlist.scrollToOffset({
            offset: this._curpos,
            animated
        });
    }
}
export default Carousel;
class SwiperItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgerror: !this.props.img
        };
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.img !== this.props.img && nextProps.img) {
            this.setState({
                imgerror: false
            });
        }
    }
    // shouldComponentUpdate() {
    //     // if(nextProps.img === this.props.img) {
    //     //     return false;
    //     // }
    //     return true;
    // }
    render() {
        return (
            <TouchableWithoutFeedback
                onPress={this.props.clickhandle}
            >
                {
                    this.state.imgerror || !this.props.img ? (
                        <ImageErrorItem height={this.props.height} />
                    ) : (
                        <View style={[styles.page,{height: this.props.height}]}>
                            <Image
                                style={styles.img}
                                resizeMode = "cover"
                                source={{uri: this.props.img}}
                                onError={() => {
                                    this.setState({
                                        imgerror: true
                                    });
                                }}
                            />
                        </View>
                    )
                }
            </TouchableWithoutFeedback>
        );
    }
}
const ImageErrorItem = ({height}) => (
    <View style={styles.errorwrapper}>
        <Label type="commonicon" size={30} style={[styles.errorimg,{height}]}>&#xe0ae;</Label>
    </View>
);
const styles = StyleSheet.create({
    page: {
        width: deviceWidth,
    },
    img: {
        flex: 1,
    },
    errorwrapper: {
        width: deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef3f5',
    },
    errorimg: {
        color: '#d2d9de'
    }
});
