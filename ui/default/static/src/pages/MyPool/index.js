import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import config from '@/config'
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        this.walletAdress = window.localStorage.getItem(config.walletAdressKey)
        if(!this.walletAdress) {
            return this.goHome()
        }
        this.render(indexHtml)
    }

    goHome() {
        window.location.hash=""
    }
}