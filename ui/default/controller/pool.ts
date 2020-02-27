import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
import config from '../config'
import Block from 'fit-block-core/app/fitblock/Block';
class PoolContoller extends baseContoller { 
    poolAddressInfo:{
        poolAddress:string,
        nowBlock:Block,
        nowTransactionList:Array<any>,
        miningCoin:number,
    };
    miningInfo:{
        nextBlockHash:string,
        processValue:bigint,
        workerPool:Map<string,{
            powValue:bigint,
            timestamp:number,
            nextBlock:any,
        }> // Pool Max Num 255
    }
    constructor() {
        super()
        this.poolAddressInfo = {
            poolAddress: config.selfWalletAddress,
            nowBlock:fitBlockCore.getPreGodBlock(),
            nowTransactionList:[],
            miningCoin:0
        }
    }
    getPoolAddressInfo() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            return this.sucess(ctx,this.poolAddressInfo)
        }
    }

    getOnlinePeople() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            const player = this.miningInfo.workerPool.get(ctx.query.walletAdress);
            if(player) {
                player.timestamp = new Date().getTime()
            }
            return this.sucess(ctx,{
                online: this.miningInfo.workerPool.size
            })
        }
    }

    applyMiningQuota() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            if(this.miningInfo.workerPool.size>255) {
                return this.error(ctx,{},'OUT_OF_MAX_ONLINE')
            }
            this.miningInfo.workerPool.set(ctx.query.walletAdress,{
                powValue:0n,
                timestamp:new Date().getTime(),
                nextBlock:null
            })
            const rangeNum = 12000n; // 两分钟最大只能挖12000n由于每次挖有10毫秒延迟最多1秒挖100n
            const startBigInt = this.miningInfo.processValue+1n;
            this.miningInfo.processValue+=rangeNum;
            return this.sucess(ctx,{
                startBigInt:startBigInt.toString(),
                endBigInt:this.miningInfo.processValue.toString(),
                nextBlockHash:this.miningInfo.nextBlockHash
            })
        }
    }

    async runMiningInfo() {
        setInterval(async ()=>{
            if(this.miningInfo.nextBlockHash!==this.poolAddressInfo.nowBlock.nextBlockHash) {
                this.miningInfo.nextBlockHash = this.poolAddressInfo.nowBlock.nextBlockHash;
                this.miningInfo.processValue = 0n;
            }
            for(const workerData of this.miningInfo.workerPool) {
                const nowTime = new Date().getTime() 
                if(workerData[1].timestamp+30*1000<nowTime) {
                    this.miningInfo.workerPool.delete(workerData[0])
                }
            }
        },30*1000)
    }

    async doPoolAddressInfo() {
        const miningData = await fitBlockCore.getMiningCoinNumberyByWalletAdress(
            this.poolAddressInfo.poolAddress,
            this.poolAddressInfo.nowBlock
        )
        this.poolAddressInfo.miningCoin+=miningData.coinNumber;
        this.poolAddressInfo.nowBlock = miningData.lastBlock
        const transactionSignList = []
        const myStore = fitBlockCore.getStore()
        for await(const transactionSign of await myStore.transactionSignIterator()) {
            transactionSignList.push(transactionSign)
        }
        this.poolAddressInfo.nowTransactionList = transactionSignList;
    }

    async runPoolAddressInfo() {
        await this.doPoolAddressInfo()
        setInterval(async ()=>{
            await this.doPoolAddressInfo()
        },60*1000)
    }
}

const poolContoller = new PoolContoller()
poolContoller.runPoolAddressInfo()
poolContoller.runMiningInfo()
export default poolContoller;