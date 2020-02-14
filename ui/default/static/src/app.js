import appHtml from '@/app.html'
import localeInit from '@/localeInit'
import myI18n from "my-i18n";
const myI18nInstance = myI18n.getInstance()
import HTMLContent from '@/components/HTMLContent'
import MyHashRoute from '@/components/MyHashRoute'
import MyRouter from '@/components/MyRouter'
import MyHeader from '@/pages/MyHeader'
import MyHome from '@/pages/MyHome'
import MyWallet from '@/pages/MyWallet'
class AppContainer extends HTMLContent {
    constructor() {
        super();
        myI18nInstance.addChangeListen((lang)=>{
          this.render(appHtml)
        })
        this.render(appHtml)
    }
  }
window.customElements.define('app-container', AppContainer);
window.customElements.define('my-header', MyHeader);
window.customElements.define('my-home', MyHome);
window.customElements.define('my-wallet', MyWallet);
window.customElements.define('my-router', MyRouter);
window.customElements.define('my-hash-route', MyHashRoute);
