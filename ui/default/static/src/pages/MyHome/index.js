import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import blockCore from 'fit-block-core/build/indexWeb';
import enUS from "./locale/en-US";
import zhCN from "./locale/zh-CN";
import myI18n from "my-i18n";
const myI18nInstance = myI18n.getInstance({
    "en-US":enUS,
    "zh-CN":zhCN,
})
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.addRandBtnListen()
        this.addIntoBtnListen()
    }

    addRandBtnListen() {
        const randBtn = this.shadow.querySelector(".private-key-rand-btn")
        randBtn.addEventListener('click',()=>{
            const privateKeyByRand = blockCore.genPrivateKeyByRand()
            const privateKeyInput = this.shadow.querySelector(".private-key-input")
            privateKeyInput.value = privateKeyByRand
        })
    }

    addIntoBtnListen() {
        const intoBtn = this.shadow.querySelector(".into-btn")
        intoBtn.addEventListener('click',()=>{
            const privateKeyInput = this.shadow.querySelector(".private-key-input")
            const privateKeyPattern = new RegExp('^[0-9a-f]{64}$','u');
            if(!privateKeyPattern.test(privateKeyInput.value)){
                return;
            }
            window.location.hash="#wallet"
        })
    }

    getTrans() {
        return {
            welcomeStr:myI18nInstance.formatMessage({id:'home.title.welcome'}),
            privateKeyStr:myI18nInstance.formatMessage({id:'home.form.private_key'}),
            randomPrivateKeyStr:myI18nInstance.formatMessage({id:'home.button.random_private_key'}),
            intoStr:myI18nInstance.formatMessage({id:'home.button.into'}),
        }
    }
}