import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import myRequest from '@/components/MyRequest'
import blockCore from 'fit-block-core/build/indexWeb';
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
import config from '@/config'
import walletAddressPermission from '@/permission/walletAddress'
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyWallet extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        this.walletAdress = window.localStorage.getItem(config.walletAdressKey)
        const transData = this.getTrans()
        this.render(indexHtml,{walletAdress:this.walletAdress,...transData})
        this.addSwitchPrivateKeyBtnListen()
        this.addMiningCoinBtnListen()
        this.addReloadCoinNumberBtnListen()
        this.addGetLastRecordsBtnListen()
        this.loadCoinNumber()
    }

    addSwitchPrivateKeyBtnListen() {
        const switchPrivateKeyBtn = this.shadow.querySelector(".switch-private-key-btn")
        switchPrivateKeyBtn.addEventListener('click',()=>{
            window.localStorage.removeItem(config.walletAdressKey)
            window.location.hash="";
        })
    }
    addMiningCoinBtnListen() {
        const miningCoinBtn = this.shadow.querySelector(".mining-coin-btn")
        miningCoinBtn.addEventListener('click',()=>{
            window.location.hash="#pool";
        })
    }
    addReloadCoinNumberBtnListen() {
        const reloadCoinNumberBtn = this.shadow.querySelector(".reload-coin-number-btn")
        reloadCoinNumberBtn.addEventListener('click',()=>{
            this.loadCoinNumber()
        })
    }
    loadCoinNumber() {
        const reloadCoinNumberBtn = this.shadow.querySelector(".reload-coin-number-btn")
        const balanceText = this.shadow.querySelector(".balance-text")
        reloadCoinNumberBtn.disabled = true;
        const coinNumberInterval = setInterval(async ()=>{
            let data = JSON.parse(window.localStorage.getItem(config.coinNumberDataKey))
            if(!data){
                const preGodBlock = blockCore.getPreGodBlock()
                data = {
                    coinNumber:0,
                    params:{
                        timestamp:preGodBlock.timestamp,
                        nextBlockHash:preGodBlock.nextBlockHash
                    }
                }
            }
            const resp = await myRequest.get('/wallet/getCoinNumber',{
                walletAdress:this.walletAdress,...data.params
            })
            // if(resp.errorCode){return;}//无需判断，会自动抛出
            data.coinNumber+=resp.data.coinNumber
            data.params = resp.data.params
            window.localStorage.setItem(config.coinNumberDataKey,JSON.stringify(data))
            clearInterval(coinNumberInterval)
            balanceText.innerText = data.coinNumber
            reloadCoinNumberBtn.disabled = false;
        }, 5*1000)
    }
    addGetLastRecordsBtnListen() {
        let data = JSON.parse(window.localStorage.getItem(config.transactionDataKey))
        if(data){this.prependUl(data.transactionList)}
        const getLastRecordsBtn = this.shadow.querySelector(".get-last-records-btn")
        getLastRecordsBtn.addEventListener('click',async()=>{
            await this.loadTransaction()
        })

    }
    async loadTransaction() {
        const getLastRecordsBtn = this.shadow.querySelector(".get-last-records-btn")
        getLastRecordsBtn.disabled = true;
        // 使用按钮load最新数据
        let data = JSON.parse(window.localStorage.getItem(config.transactionDataKey))
        if(!data){
            const preGodBlock = blockCore.getPreGodBlock()
            data = {
                // 这里设置限制，web只显示末尾10条内容
                transactionList:[],
                params:{
                    timestamp:preGodBlock.timestamp,
                    nextBlockHash:preGodBlock.nextBlockHash
                }
            }
        }
        const resp = await myRequest.get('/wallet/getTransactions',{
            walletAdress:this.walletAdress, limit:15, ...data.params
        })
        getLastRecordsBtn.disabled = false;
        if(resp.data.transactionList.length<=0){return;}
        data.transactionList = resp.data.transactionList
        data.params = resp.data.params
        window.localStorage.setItem(config.transactionDataKey,JSON.stringify(data))
        this.prependUl(data.transactionList)
    }

    prependUl(transactionList) {
        const transactionUl = this.shadow.querySelector(".transaction-ul")
        let liStr = ''
        for(const transactionObj of transactionList) {
            const transaction = blockCore.getStore().getTransactionSignByStr(
                JSON.stringify(transactionObj)
            ) 
            liStr+=`<li>${
                myI18nInstance.formatMessage({id:'wallet.title.transactionRecord'},{
                    sendAddress:transaction.transaction.senderAdress,
                    datetime:new Date(transaction.transaction.timestamp).toString(),
                    acceptAddress:transaction.transaction.accepterAdress,
                    coinNumber:transaction.transaction.transCoinNumber,
                    tradingNumber:transaction.transaction.getTradingFees(),
                    arriveNumber:transaction.transaction.getArriveFees(),
                })
            }</li>`
        }
        transactionUl.prepend(liStr)
    }
    getTrans() {
        return {
            switchPrivateKeyStr:myI18nInstance.formatMessage({id:'wallet.button.switchPrivateKey'}),
            miningPoolStr:myI18nInstance.formatMessage({id:'wallet.button.miningPool'}),
            transferStr:myI18nInstance.formatMessage({id:'wallet.button.transfer'}),
            reloadBalanceStr:myI18nInstance.formatMessage({id:'wallet.button.reloadBalance'}),
            getLastTransactionRecordsStr:myI18nInstance.formatMessage({id:'wallet.button.getLastTransactionRecords'}),
            balanceStr:myI18nInstance.formatMessage({id:'wallet.text.balance'}),
            loadingStr:myI18nInstance.formatMessage({id:'wallet.text.loading'}),
            onlyShowLastRecordsStr:myI18nInstance.formatMessage({id:'wallet.text.onlyShowLastRecords'}),
            walletAddressStr:myI18nInstance.formatMessage({id:'wallet.title.walletAddress'}),
            transactionFlowStr:myI18nInstance.formatMessage({id:'wallet.title.transactionFlow'})
        }
    }
}