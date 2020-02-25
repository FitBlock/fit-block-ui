import indexHtml from './index.html'
import HTMLContent from '@/components/HTMLContent'
import walletAddressPermission from '@/permission/walletAddress'
import blockCore from 'fit-block-core/indexWeb.js';
import myRequest from '@/components/MyRequest'
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import myI18n from 'my-i18n';
const myI18nInstance = myI18n.getInstance({
    'en-US':enUS,
    'zh-CN':zhCN,
})
export default class MyHome extends HTMLContent {
    constructor() {
        super();
        walletAddressPermission.checkWalletAdress()
        const transData = this.getTrans()
        this.render(indexHtml,{...transData})
        this.getPoolAddressInfo()
        this.poolAddressInfo = {
            poolAddress:'',
            nowBlock:blockCore.getPreGodBlock()
        }
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
            this.startMining()
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
            myStore.getTransactionSignByStr(JSON.stringify(transactionData))
        })
        this.poolAddressInfo.nowTransactionList = transactionList
        const poolAddressSpan = this.shadow.querySelector(".pool-address")
        this.poolAddressInfo.poolAddress = resp.data.poolAddress
        poolAddressSpan.innerText = resp.data.poolAddress;
        const poolEarnedSpan = this.shadow.querySelector(".pool-earned")
        poolEarnedSpan.innerText = resp.data.miningCoin;
        
    }
    async preMining() {
        const preMiningTime = 10 * 1000;// 10s
        const expectedTime = 120 * 1000; //2min
        const startTime = new Date().getTime()
        const miningBlock = blockCore.getPreGodBlock()
        await blockCore.mining(
            this.poolAddressInfo.nowBlock,
            this.poolAddressInfo.poolAddress,
            async (nextBlock)=>{
                const nowTime = new Date().getTime()
                if(nowTime-preMiningTime>=startTime) {
                    miningBlock = nextBlock;
                    return false;
                }
                return true
            }
        )
        return  BigInt(`0x${miningBlock.blockVal}`)*BigInt(expectedTime/preMiningTime)
    }
    async startMining() {
        const coreConfig = blockCore.getConfig()
        const showTextDialog = this.shadow.querySelector(".show-text-dialog")
        if(this.nowBlock.height<coreConfig.godBlockHeight) {
            showTextDialog.innerText = 'please wait node sync'
            showTextDialog.showModal()
            return 
        }
        const rangeNum = await this.preMining();
        // to do 
        /**
         * 首先先预挖10S判断机器性能
         * 然后分配大约两分钟的量给这台机器
         * 挖好后将hash的最大值给服务，服务出块后分配矿工货币
         * 如果出块，但最新块被放弃，则矿池亏损
         */
    }

}