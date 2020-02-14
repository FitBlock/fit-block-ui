import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import myI18n from "my-i18n";
const myI18nInstance = myI18n.getInstance()
export default class MyHeader extends HTMLContent {
    constructor() {
        super();
        const langList = [
            {lang:'zh-CN',name:'简体中文'},
            {lang:'en-US',name:'English'}
        ]
        this.render(indexHtml)
        this.addSelectOption(langList)
        this.addSelectListen()
    }
    addSelectListen() {
        const selectDom = this.shadow.querySelector(".lang-select")
        selectDom.addEventListener('change',(event) =>{
            myI18nInstance.changeLang(event.target.value)
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
}