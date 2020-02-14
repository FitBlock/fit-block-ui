import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
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