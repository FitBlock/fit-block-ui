import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import blockCore from 'fit-block-core/build/indexWeb';
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
import config from '@/config'
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        const walletAdress = window.localStorage.getItem(config.walletAdressKey)
        if(walletAdress) {
            return this.toWallet()
        }
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.addListen()
    }
    addListen() {
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        privateKeyInput.addEventListener('keyup',(e)=>{
            this.onPrivateKeyInputEnter(e)
        })
        const randBtn = this.shadow.querySelector(".private-key-rand-btn")
        randBtn.addEventListener('click',()=>{
            this.randPrivateKey()
        })
        const genPrivateKeyBtn = this.shadow.querySelector(".gen-private-key-btn")
        genPrivateKeyBtn.addEventListener('click',()=>{
            this.toGenPrivateKey()
        })
        const intoForm = this.shadow.querySelector(".into-form")
        intoForm.onsubmit = () =>{
            this.intoWallet()
            return false;
        }
    }
    onPrivateKeyInputEnter(event) {
        if(event.keyCode===13) {
            const intoForm = this.shadow.querySelector(".into-form")
            intoForm.submit()
        }
    }
    randPrivateKey() {
        const privateKeyByRand = blockCore.genPrivateKeyByRand()
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        privateKeyInput.value = privateKeyByRand
    }

    toGenPrivateKey() {
        window.location.hash="#gen-private"
    }

    intoWallet() {
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        const walletAdress = blockCore.getWalletAdressByPublicKey(
            blockCore.getPublicKeyByPrivateKey(privateKeyInput.value)
        )
        window.localStorage.setItem(config.walletAdressKey,walletAdress)
        this.toWallet()
    }

    toWallet() {
        window.location.hash="#wallet"
    }

    getTrans() {
        return {
            welcomeStr:myI18nInstance.formatMessage({id:'home.title.welcome'}),
            privateKeyStr:myI18nInstance.formatMessage({id:'home.form.privateKey'}),
            inputOrRandomPrivateKeyStr:myI18nInstance.formatMessage({id:'home.form.inputOrRandomPrivateKey'}),
            privateKeyFormatStr:myI18nInstance.formatMessage({id:'home.form.privateKeyFormat'}),
            randomPrivateKeyStr:myI18nInstance.formatMessage({id:'home.button.randomPrivateKey'}),
            genPrivateKeyStr:myI18nInstance.formatMessage({id:'home.button.genPrivateKey'}),
            intoStr:myI18nInstance.formatMessage({id:'home.button.into'}),
        }
    }
}