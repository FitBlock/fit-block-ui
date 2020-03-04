import appHtml from '@/app.html'
import myI18nInstance from '@/localeInit'
import HTMLContent from '@/components/HTMLContent'
import MyHashRoute from '@/components/MyHashRoute'
import MyRouter from '@/components/MyRouter'
import MyHeader from '@/pages/MyHeader'
import MyHome from '@/pages/MyHome'
import MyWallet from '@/pages/MyWallet'
import MyPool from '@/pages/MyPool'
import MyTrans from '@/pages/MyTrans'
import GenPrivate from '@/pages/GenPrivate'
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
window.customElements.define('my-pool', MyPool);
window.customElements.define('my-trans', MyTrans);
window.customElements.define('gen-private', GenPrivate);
window.customElements.define('my-router', MyRouter);
window.customElements.define('my-hash-route', MyHashRoute);
