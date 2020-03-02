import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import walletAddressPermission from '@/permission/walletAddress'
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyTrans extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.addListen()
    }
    addListen() {

    }

    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params)
        }
    }
}