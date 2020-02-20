import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import blockCore from 'fit-block-core/build/indexWeb';
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class GenPrivate extends HTMLContent {
    constructor() {
        super();
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.addListen()
    }
    addListen() {
        const intoForm = this.shadow.querySelector(".gen-private-key-form")
        intoForm.onsubmit = () =>{
            this.genPrivateKey()
            return false;
        }
        const copyClipAndBackBtn = this.shadow.querySelector(".copy-clip-and-back-btn")
        copyClipAndBackBtn.addEventListener('click',()=>{
            this.copyClipAndBack()
        })
    }
    genPrivateKey() {
        const genPrivateTextarea = this.shadow.querySelector(".gen-private-textarea")
        const privateKey = blockCore.genPrivateKeyByString(genPrivateTextarea.value)
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        privateKeyInput.value = privateKey;
        const copyClipAndBackBtn = this.shadow.querySelector(".copy-clip-and-back-btn")
        copyClipAndBackBtn.disabled = false
    }
    copyClipAndBack() {
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        privateKeyInput.select()
        document.execCommand("Copy");
        this.goBack()
    }

    goBack() {
        window.history.go(-1)
    }

    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params),
        }
    }
}