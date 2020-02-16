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
        this.addGenPrivateKeyBtnListen()
        this.addCopyClipAndBackBtnListen()
    }

    addGenPrivateKeyBtnListen() {
        const intoForm = this.shadow.querySelector(".gen-private-key-form")
        intoForm.onsubmit = () =>{
            const genPrivateTextarea = this.shadow.querySelector(".gen-private-textarea")
            const privateKey = blockCore.genPrivateKeyByString(genPrivateTextarea.value)
            const privateKeyInput = this.shadow.querySelector(".private-key-input")
            privateKeyInput.value = privateKey;
            const copyClipAndBackBtn = this.shadow.querySelector(".copy-clip-and-back-btn")
            copyClipAndBackBtn.disabled = false
            return false;
        }
    }
    addCopyClipAndBackBtnListen() {
        const copyClipAndBackBtn = this.shadow.querySelector(".copy-clip-and-back-btn")
        copyClipAndBackBtn.addEventListener('click',()=>{
            const privateKeyInput = this.shadow.querySelector(".private-key-input")
            privateKeyInput.select()
            document.execCommand("Copy");
            this.goBack()
        })
    }

    goBack() {
        window.history.go(-1)
    }

    getTrans() {
        return {
            characterPlaceholderStr:myI18nInstance.formatMessage({id:'genPrivate.form.characterPlaceholder'}),
            generatePrivateByTextStr:myI18nInstance.formatMessage({id:'genPrivate.button.generatePrivateByText'}),
            privateKeyPlaceholderStr:myI18nInstance.formatMessage({id:'genPrivate.form.privateKeyPlaceholder'}),
            copyclipAndBackStr:myI18nInstance.formatMessage({id:'genPrivate.button.copyclipAndBack'}),
        }
    }
}