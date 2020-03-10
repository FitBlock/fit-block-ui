import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import walletAddressPermission from '@/permission/walletAddress'
import config from '@/config'
import blockCore from 'fit-block-core/build/indexWeb.js';
import myRequest from '@/components/MyRequest'
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
const miningStatusEnum = {
    stop: 1,
    start: 2,
    stoping: 3,
}
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        this.walletAdress = window.localStorage.getItem(config.walletAdressKey)
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.getPoolAddressInfo()
        this.poolAddressInfo = {
            poolAddress:'',
            nowBlock:blockCore.getPreGodBlock(),
            nowTransactionList:[]
        }
        this.miningStatus = miningStatusEnum.stop
        this.addListen()
    }

    getTrans() {
        return {
            myI18n:(id,params={})=>myI18nInstance.formatMessage({id},params)
        }
    }

    addListen() {
        const startMiningBtn = this.shadow.querySelector(".start-mining-btn")
        startMiningBtn.addEventListener('click',()=>{
            switch(this.miningStatus) {
                case miningStatusEnum.stop:
                    this.startMining()
                    break;
                case miningStatusEnum.start:
                    this.stopMining()
                    break;
                default:
                    break;
            }
        })
        const backWalletBtn = this.shadow.querySelector(".back-wallet-btn")
        backWalletBtn.addEventListener('click',()=>{
            const isContinueLevel = window.confirm(
                myI18nInstance.formatMessage({id:"pool.text.stopMinigBackWallet"})
            )
            if(!isContinueLevel){return}
            window.location.hash="#wallet";
        })
        const showTextDialog = this.shadow.querySelector(".show-text-dialog")
        showTextDialog.addEventListener('click',()=>{
            showTextDialog.close()
        })
    }
    
    async getPoolAddressInfo() {
        const resp = await myRequest.get('/pool/getPoolAddressInfo')
        const myStore = blockCore.getStore()
        this.poolAddressInfo.nowBlock = myStore.getBlockByStr(JSON.stringify(resp.data.nowBlock))
        const transactionList = resp.data.nowTransactionList.map((transactionData)=>{
            return myStore.getTransactionSignByStr(JSON.stringify(transactionData))
        })
        this.poolAddressInfo.nowTransactionList = transactionList
        const poolAddressSpan = this.shadow.querySelector(".pool-address")
        this.poolAddressInfo.poolAddress = resp.data.poolAddress
        poolAddressSpan.innerText = resp.data.poolAddress;
        const poolEarnedSpan = this.shadow.querySelector(".pool-earned")
        poolEarnedSpan.innerText = resp.data.miningCoin;
        
    }
    showMiningNextBlockHash(refreshTime) {
        let miningNextBlockHash = undefined;
        const miningNextBlockHashInterval = setInterval(()=>{
            if(!miningNextBlockHash) {
                clearInterval(miningNextBlockHashInterval)
                return;
            }
            const miningNextBlockHashSpan = this.shadow.querySelector(".mining-next-block-hash")
            miningNextBlockHashSpan.innerText = miningNextBlockHash
            miningNextBlockHash = undefined;
        },refreshTime)
        return (nextBlockHash)=>{
            miningNextBlockHash = nextBlockHash
        }
    }
    async getOnlinePeople(refreshTime) {
        let send = true;
        const requestFunc = async ()=>{
            const onlinePeopleSpan = this.shadow.querySelector(".online-people")
            if(!send) {
                clearInterval(getOnlinePeopleInterval)
                onlinePeopleSpan.innerText = '';
                return;
            }
            const resp = await myRequest.get('/pool/getOnlinePeople',{walletAdress:this.walletAdress})
            onlinePeopleSpan.innerText = myI18nInstance.formatMessage({
                id:"pool.text.onlinePeople"
            },resp.data)
            send = false;
        }
        await requestFunc()
        const getOnlinePeopleInterval = setInterval(async ()=>{
            requestFunc()
        },refreshTime)
        return ()=>{
            send = true
        }
    }
    async stopMining() {
        const startMiningBtn = this.shadow.querySelector(".start-mining-btn")
        this.miningStatus = miningStatusEnum.stoping;
        startMiningBtn.innerText = myI18nInstance.formatMessage({id:"pool.button.StopingMining"})
        startMiningBtn.disabled = true
    }
    async startMining() {
        const preGodBlock = blockCore.getPreGodBlock()
        const showTextDialog = this.shadow.querySelector(".show-text-dialog")
        const coreConfig = blockCore.getConfig()
        if(
            this.poolAddressInfo.nowBlock.nextBlockHash===preGodBlock.nextBlockHash ||
            this.poolAddressInfo.nowBlock.height<coreConfig.godBlockHeight
        ) {
            showTextDialog.innerText = myI18nInstance.formatMessage({id:"pool.dialog.pleaseWaitNodeSync"})
            showTextDialog.showModal()
            return 
        }
        const startMiningBtn = this.shadow.querySelector(".start-mining-btn")
        startMiningBtn.innerText = myI18nInstance.formatMessage({id:"pool.button.stopMining"})
        this.miningStatus = miningStatusEnum.start
        await this.getPoolAddressInfo()
        let startBigInt = 0n;
        let endBigInt = 0n;
        try{
            const resp = await myRequest.get('/pool/applyMiningQuota',{
                walletAdress:this.walletAdress
            })
            startBigInt = BigInt(resp.data.startBigInt)
            endBigInt = BigInt(resp.data.endBigInt)
        }catch(err) {
            showTextDialog.innerText = myI18nInstance.formatMessage({id:`pool.error.${err.message}`})
            showTextDialog.showModal()
        }
        const showHashFunc = this.showMiningNextBlockHash(300);
        const showOnlinePeopleFunc = await this.getOnlinePeople(10*1000);
        let maxPowValue = 0n;
        let maxBlock = this.poolAddressInfo.nowBlock;
        await blockCore.mining(
            this.poolAddressInfo.nowBlock,
            this.poolAddressInfo.poolAddress,
            this.poolAddressInfo.nowTransactionList,
            async (nextBlock, isComplete)=>{
                const nowBigInt =  BigInt(`0x${nextBlock.blockVal}`)
                const nowPowValue = this.poolAddressInfo.nowBlock.getNextBlockValPowValue(nextBlock)
                if(nowPowValue>maxPowValue) {
                    maxPowValue = nowPowValue
                    maxBlock = nextBlock;
                }
                if(endBigInt<nowBigInt || isComplete) {
                    await myRequest.post('/pool/acceptMiningBlock',{
                        walletAdress:this.walletAdress,
                        isComplete,
                        block:this.poolAddressInfo.nowBlock.outBlock(maxBlock)
                    })
                    return false
                }
                showHashFunc(nextBlock.genBlockHash())
                showOnlinePeopleFunc();
                return true
            },
            startBigInt
        )
        if(this.miningStatus===miningStatusEnum.start) {
            this.startMining()
        } else {
            this.miningStatus = miningStatusEnum.stop;
            startMiningBtn.innerText = myI18nInstance.formatMessage({id:"pool.button.coinMining"})
            startMiningBtn.disabled = false
        }
    }

}