import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyHeader extends HTMLContent {
    constructor() {
        super();
        const langList = [
            {lang:'zh-CN',name:'简体中文'},
            {lang:'en-US',name:'English'}
        ]
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.addSelectOption(langList)
        this.addSelectListen()
    }
    addSelectListen() {
        const selectDom = this.shadow.querySelector(".lang-select")
        selectDom.addEventListener('change',(event) =>{
            myI18nInstance.changeLang(event.target.value)
        })
        const buildSelfPoolBtn = this.shadow.querySelector(".build-self-pool")
        buildSelfPoolBtn.addEventListener('click',(event) =>{
            window.open('https://github.com/FitBlock/fit-block#build-node')
        })
    }
    addSelectOption(langList) {
        const lang = myI18nInstance.getLang()
        const selectDom = this.shadow.querySelector(".lang-select")
        for(const langItem of langList) {
            const option = document.createElement("option");
            option.value = langItem.lang
            if(option.value === lang){option.selected=true}
            option.text = langItem.name
            selectDom.add(option)
        }
        
    }
    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params),
        }
    }
}