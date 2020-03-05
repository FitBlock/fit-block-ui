import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import walletAddressPermission from '@/permission/walletAddress'
import blockCore from 'fit-block-core/build/indexWeb.js';
import myRequest from '@/components/MyRequest'
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
import config from '@/config'
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyTrans extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.addListen()
        const preGodBlock = blockCore.getPreGodBlock()
        this.transData = {
            transList:[],
            params:{
                timestamp:preGodBlock.timestamp,
                nextBlockHash:preGodBlock.nextBlockHash
            }
        }
        let data = JSON.parse(window.localStorage.getItem(config.tradeTransactionDataKey))
        if(data){
            this.transData.transList = data.transList;
            this.transData.params = data.params
        }
        
    }
    addListen() {
        const tradeForm = this.shadow.querySelector(".trade-form")
        tradeForm.onsubmit = async () =>{
            await this.tradeTransaction()
            return false;
        }
        const showTextDialog = this.shadow.querySelector(".show-text-dialog")
        showTextDialog.addEventListener('click',()=>{
            showTextDialog.close()
        })
    }
    async tradeTransaction() {
        // todo 
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        const accepterWalletAddressInput = this.shadow.querySelector(".accepter-wallet-address-input")
        const volumeInput = this.shadow.querySelector(".volume-input")
        const transaction = await blockCore.genTransaction(privateKeyInput, accepterWalletAddressInput, volumeInput);
        try{
            await myRequest.post('/trans/keepTrans',{
                transactionSign:transaction
            })
        } catch(err) {
            showTextDialog.innerText = myI18nInstance.formatMessage({id:`trans.error.${err.message}`})
            showTextDialog.showModal()
        }
        await this.refreshTransaction();
    }
    async refreshTransaction() {
        // todo 通过this.transData获取数据
    }

    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params)
        }
    }
}