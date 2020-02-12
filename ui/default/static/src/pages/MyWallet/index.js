import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
export default class MyWallet extends HTMLContent {
    constructor() {
        super();
        this.render(indexHtml)
    }
}