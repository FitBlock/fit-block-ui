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
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        const transData = this.getTrans()
        this.render(indexHtml,{walletAdress:this.walletAdress,...transData})
    }
    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params)
        }
    }

    startMining() {
        // to do 
        /**
         * 首先先预挖10S判断机器性能
         * 然后分配大约两分钟的量给这台机器
         * 挖好后将hash的最大值给服务，服务出块后分配矿工货币
         * 如果出块，但最新块被放弃，则矿池亏损
         */
    }

}