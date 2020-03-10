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
        const backWalletBtn = this.shadow.querySelector(".back-wallet-btn")
        backWalletBtn.addEventListener('click',()=>{
            window.location.hash="#wallet";
        })
    }
    async tradeTransaction() {
        const privateKeyInput = this.shadow.querySelector(".private-key-input")
        const accepterWalletAddressInput = this.shadow.querySelector(".accepter-wallet-address-input")
        const volumeInput = this.shadow.querySelector(".volume-input")
        const transactionSign = await blockCore.genTransaction(
            privateKeyInput.value, accepterWalletAddressInput.value, volumeInput.value);
        try{
            await myRequest.post('/trans/keepTrans',{
                transactionSign
            })
        } catch(err) {
            showTextDialog.innerText = myI18nInstance.formatMessage({id:`trans.error.${err.message}`})
            showTextDialog.showModal()
        }
        this.transData.transList.push(transactionSign)
        if(this.transData.transList.length>100) {
            this.transData.transList.shift()
        }
        window.localStorage.setItem(config.tradeTransactionDataKey, this.transData)
        await this.refreshTransaction();
    }

    async refreshTransaction() {
        const startBlock = blockCore.getPreGodBlock()
        startBlock.timestamp = this.this.transData.params.timestamp;
        startBlock.nextBlockHash = this.this.transData.params.nextBlockHash;
        for(const transactionSign of this.transData.transList) {
            const resp = await myRequest.post('/trans/checkIsTransInBlock',{
                startBlock,
                transactionSign
            })
            transactionSign.inBlockHash = resp.data.inBlockHash
        }
        this.renderTransList(this.transData.transList)
        const getLastBlockResp = await myRequest.post('/trans/getLastBlock',{
            startBlock
        })
        this.this.transData.params.timestamp = getLastBlockResp.data.lastBlock.timestamp;
        this.this.transData.params.nextBlockHash = getLastBlockResp.data.lastBlock.nextBlockHash;
        window.localStorage.setItem(config.tradeTransactionDataKey, this.transData)
    }

    async renderTransList(transList) {
        const transactionUl = this.shadow.querySelector(".transaction-ul")
        let liStr = ''
        for(const transactionSign of transList) {
            liStr+=`<li>${
                myI18nInstance.formatMessage({id:'trans.text.transactionRecord'},{
                    sendAddress:transactionSign.transaction.senderAdress,
                    datetime:new Date(transactionSign.transaction.timestamp).toString(),
                    acceptAddress:transactionSign.transaction.accepterAdress,
                    coinNumber:transactionSign.transaction.transCoinNumber,
                    isComplete:transactionSign.inBlockHash
                })
            }</li>`
        }
        transactionUl.innerHTML = liStr
    }

    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params)
        }
    }
}