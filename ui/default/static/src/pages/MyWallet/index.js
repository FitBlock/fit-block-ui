import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
import config from '@/config'
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyWallet extends HTMLContent {
    constructor() {
        super();
        const walletAdress = window.localStorage.getItem(config.walletAdressKey)
        if(!walletAdress) {
            return this.goHome()
        }
        const transData = this.getTrans()
        this.render(indexHtml,{walletAdress,...transData})
        this.addSwitchPrivateKeyBtnListen()
    }

    addSwitchPrivateKeyBtnListen() {
        const switchPrivateKeyBtn = this.shadow.querySelector(".switch-private-key-btn")
        switchPrivateKeyBtn.addEventListener('click',()=>{
            window.localStorage.removeItem(config.walletAdressKey)
            window.location.hash="";
        })
    }
    getTrans() {
        return {
            switchPrivateKeyStr:myI18nInstance.formatMessage({id:'wallet.button.switchPrivateKey'}),
            miningPoolStr:myI18nInstance.formatMessage({id:'wallet.button.miningPool'}),
            transferStr:myI18nInstance.formatMessage({id:'wallet.button.transfer'}),
            balanceStr:myI18nInstance.formatMessage({id:'wallet.text.balance'}),
            loadingStr:myI18nInstance.formatMessage({id:'wallet.text.loading'}),
            walletAddressStr:myI18nInstance.formatMessage({id:'wallet.title.walletAddress'}),
            transactionFlowStr:myI18nInstance.formatMessage({id:'wallet.title.transactionFlow'})
        }
    }

    goHome() {
        window.location.hash=""
    }
}