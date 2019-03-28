/**
 * 图片汇总
 * lufj@ctrip.com
 * @providesModule Icon
 */
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {normalize} from './util';

const styles = StyleSheet.create({
    icon: {
        color: '#88ce35',
        fontFamily: 'crn_font_ttd_ticket',
        fontSize: normalize(20),
    }
});
const icon = {
    //成人票
    'tickettype-chengrp': props => (
        <Text style={styles.icon} {...props}>&#xe4a2;</Text>
    ),
    //儿童票
    'tickettype-ertp': props => (
        <Text style={styles.icon} {...props}>&#xe4a3;</Text>
    ),
    //婴幼儿票
    'tickettype-yingyrp': props => (
        <Text style={styles.icon} {...props}>&#xe4c3;</Text>
    ),
    //老人票
    'tickettype-laorp': props => (
        <Text style={styles.icon} {...props}>&#xe4a6;</Text>
    ),
    //亲子票（1大1小）
    'tickettype-qinzp11': props => (
        <Text style={styles.icon} {...props}>&#xe4a9;</Text>
    ),
    //家庭票（2大1小）
    'tickettype-jiatp21': props => (
        <Text style={styles.icon} {...props}>&#xe4a4;</Text>
    ),
    //家庭票（2大2小）
    'tickettype-jiatp22': props => (
        <Text style={styles.icon} {...props}>&#xe4bd;</Text>
    ),
    //双人票
    'tickettype-shuangrp': props => (
        <Text style={styles.icon} {...props}>&#xe4c1;</Text>
    ),
    //情侣票
    'tickettype-qinglp': props => (
        <Text style={styles.icon} {...props}>&#xe4c7;</Text>
    ),
    //三人票
    'tickettype-sanrp': props => (
        <Text style={styles.icon} {...props}>&#xe4e0;</Text>
    ),
    //团队票
    'tickettype-tuandp': props => (
        <Text style={styles.icon} {...props}>&#xe4c2;</Text>
    ),
    //学生票
    'tickettype-xuesp': props => (
        <Text style={styles.icon} {...props}>&#xe4aa;</Text>
    ),
    //女士票
    'tickettype-nvsp': props => (
        <Text style={styles.icon} {...props}>&#xe4c6;</Text>
    ),
    //男士票
    'tickettype-nansp': props => (
        <Text style={styles.icon} {...props}>&#xe4c5;</Text>
    ),
    //优待票
    'tickettype-huihp': props => (
        <Text style={styles.icon} {...props}>&#xe4c4;</Text>
    ),
    //教师票
    'tickettype-jiaosp': props => (
        <Text style={styles.icon} {...props}>&#xe4be;</Text>
    ),
    //军人票
    'tickettype-junrp': props => (
        <Text style={styles.icon} {...props}>&#xe4cd;</Text>
    ),
    //残疾票
    'tickettype-canjp': props => (
        <Text style={styles.icon} {...props}>&#xe4bf;</Text>
    ),
    //返
    'tickettype-fan': (props) => {
        const {style,...otherprops} = props;
        return (
            <Text style={[styles.icon,style]} {...otherprops}>&#xe49f;</Text>
        );
    },
    //省
    'tickettype-sheng': (props) => {
        const {style,...otherprops} = props;
        return (
            <Text style={[styles.icon,style]} {...otherprops}>&#xe49e;</Text>
        );
    },
    //立减
    'tickettype-jian': (props) => {
        const {style,...otherprops} = props;
        return (
            <Text style={[styles.icon,style]} {...otherprops}>&#xe50a;</Text>
        );
    },
    //赠
    'tickettype-zeng': (props) => {
        const {style,...otherprops} = props;
        return (
            <Text style={[styles.icon,style]} {...otherprops}>&#xe7f2;</Text>
        );
    },
};
const Icon = (props) => {
    const {ticketype,...otherprops} = props;
    const curicon = icon['tickettype-' + ticketype];
    if(curicon) {
        return curicon(otherprops);
    }
    return null;
};
export default Icon;
