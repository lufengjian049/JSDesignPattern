/**
 * 模块版本控制，
 * 只支持两种版本，老版 和 新版
 * lufj@ctrip.com
 * @providesModule versionControlDecorator
 */
import React, { Component } from 'react';
import abTestConfig from '../abTestConfig';

const versionControlDecorator = (OldVersionComponent,abtestno) => NewVersionComponent => class extends Component {
    static displayName = `${OldVersionComponent.displayName || 'versionControlDecorator'}`
    render() {
        if(abTestConfig.checkCurrVersionIsOldOrNew(abtestno)) {
            return (
                <OldVersionComponent {...this.props} />
            );
        }
        if(NewVersionComponent) {
            return (
                <NewVersionComponent {...this.props} />
            );
        }
        return null;
    }
};

export default versionControlDecorator;
