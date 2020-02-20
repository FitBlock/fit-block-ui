import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import walletAddressPermission from '@/permission/walletAddress'
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        this.render(indexHtml)
    }
}