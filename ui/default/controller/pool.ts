import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
import config from '../config'
// 本来预计项目小，看来还是得要server层，现在有点凌乱了，下次迁移
// 暂时想不到更好的方法来实现类型提示
import Block from 'fit-block-core/build/app/fitblock/Block';
class PoolContoller extends baseContoller { 
    poolAddressInfo:{
        poolAddress:string,
        nowBlock:Block,
        isLock:boolean,
        nowTransactionList:Array<any>,
        miningCoin:number,
    };
    miningInfo:{
        nextBlockHash:string,
        processValue:bigint,
        workerPool:Map<string,{
            powValue:bigint,
            timestamp:number,
            nextBlock:Block,
        }> // Pool Max Num 255
    }
    constructor() {
        super()
        this.poolAddressInfo = {
            poolAddress: fitBlockCore.getWalletAdressByPublicKey(
                fitBlockCore.getPublicKeyByPrivateKey(config.selfWalletAddressPrivate)
            ),
            isLock:false,
            nowBlock:fitBlockCore.getPreGodBlock(),
            nowTransactionList:[],
            miningCoin:0
        }
        this.miningInfo = {
            nextBlockHash:'',
            processValue:0n,
            workerPool:new Map()
        }
    }
    getPoolAddressInfo() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            return this.sucess(ctx,this.poolAddressInfo)
        }
    }
    acceptMiningBlock() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            if(!ctx.post.walletAdress) {
                return this.error(ctx,{
                    walletAdress:ctx.post.walletAdress
                },'NEED_PARAMS')
            }
            if(!ctx.post.block) {
                return this.error(ctx,{
                    block:ctx.post.block
                },'NEED_PARAMS')
            }
            const player = this.miningInfo.workerPool.get(ctx.query.walletAdress);
            if(!player) {
                return this.error(ctx,{
                    block:ctx.post.block
                },'YOU_OUT_LINE')
            }
            const myStore = fitBlockCore.getStore()
            const nextBlock = myStore.getBlockByStr(JSON.stringify(ctx.post.block))
            player.timestamp = new Date().getTime();
            player.nextBlock = nextBlock;
            if(ctx.post.isComplete) {
                if(this.poolAddressInfo.nowBlock.verifyNextBlock(nextBlock)) {
                    // 分赃
                    await this.allocateCoin(nextBlock);
                    return this.sucess(ctx,{ok:true})
                }
            }
            return this.sucess(ctx,{ok:false})
        }
    }

    resetMiningInfo() {
        this.miningInfo.nextBlockHash = this.poolAddressInfo.nowBlock.nextBlockHash;
        this.miningInfo.processValue = 0n;
    }

    async allocateCoin(nextBlock) {
        if(this.poolAddressInfo.isLock){return}
        this.poolAddressInfo.isLock = true;
        await fitBlockCore.keepBlockData(this.poolAddressInfo.nowBlock, nextBlock)
        let totalPowValue = 0n
        for(const workerData of this.miningInfo.workerPool) {
            workerData[1].powValue = this.poolAddressInfo.nowBlock.getNextBlockValPowValue(workerData[1].nextBlock);
            totalPowValue+=workerData[1].powValue
        }
        for(const workerData of this.miningInfo.workerPool) {
            const allocateCoinNumber = workerData[1].powValue*BigInt(workerData[1].nextBlock.getOutBlockCoinNumber())/totalPowValue;
            if(allocateCoinNumber>=2n) {
                await fitBlockCore.keepTransaction(
                    await fitBlockCore.genTransaction(
                        config.selfWalletAddressPrivate,workerData[0],parseInt(allocateCoinNumber.toString())
                    )
                )
            }
            // 使得在线重新计算
            workerData[1].nextBlock = fitBlockCore.getPreGodBlock()
            workerData[1].powValue = 0n
        }
        this.poolAddressInfo.nowBlock = nextBlock;
        this.resetMiningInfo()
        this.poolAddressInfo.isLock = false;
    }

    getOnlinePeople() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            if(!ctx.query.walletAdress) {
                return this.error(ctx,{
                    walletAdress:ctx.query.walletAdress
                },'NEED_PARAMS')
            }
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
            if(!ctx.query.walletAdress) {
                return this.error(ctx,{
                    walletAdress:ctx.query.walletAdress
                },'NEED_PARAMS')
            }
            if(this.miningInfo.workerPool.size>=255) {
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
    async doMiningInfo() {
        for(const workerData of this.miningInfo.workerPool) {
            const nowTime = new Date().getTime() 
            if(workerData[1].timestamp+30*1000<nowTime) {
                this.miningInfo.workerPool.delete(workerData[0])
            }
        }
    }
    async runMiningInfo() {
        await this.doMiningInfo()
        setInterval(async ()=>{
            await this.doMiningInfo()
        },30*1000)
    }

    async doPoolAddressInfo() {
        const miningData = await fitBlockCore.getMiningCoinNumberyByWalletAdress(
            this.poolAddressInfo.poolAddress,
            this.poolAddressInfo.nowBlock
        )
        this.poolAddressInfo.miningCoin+=miningData.coinNumber;
        this.poolAddressInfo.nowBlock = miningData.lastBlock
        if(this.miningInfo.nextBlockHash!==this.poolAddressInfo.nowBlock.nextBlockHash) {
            this.resetMiningInfo()
        }
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
async function run() {
    await poolContoller.runPoolAddressInfo();
    await poolContoller.runMiningInfo();
}
run()
export default poolContoller;