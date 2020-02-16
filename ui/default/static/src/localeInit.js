import myI18n from "my-i18n";
import enUS from "./locale/en-US";
import zhCN from "./locale/zh-CN";
/**
 * 本国际化方案支持可切入式编程
 * 可改写或在方法的前后进行操作
 */
const langKey = "langStorageKey";
myI18n.init((myLocale)=>{
    let defaultLang = (navigator.language||navigator.userLanguage)==='zh-CN'?'zh-CN':'en-US'
    // 对方法进行重写或AOP编程
    return new Proxy(myLocale,{
        get: function(target, property) {
            switch(property) {
            case 'getLang':
                return function() {
                    let langVal = localStorage.getItem(langKey);
                    return langVal?langVal:defaultLang;
                }
            case 'setLang':
            case 'changeLang':
                return function(nowLang) {
                    localStorage.setItem(langKey, nowLang);
                    return target[property](nowLang);
                }
            }
            return target[property];
        }
    })
},
// 引用基本的国际化文案
{
    "en-US":enUS,
    "zh-CN":zhCN,
})

export default myI18n.getInstance()