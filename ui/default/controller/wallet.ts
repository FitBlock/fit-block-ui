import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
import blockServer from '../server/block';
// 本来预计项目小，看来还是得要server层，现在有点凌乱了，下次迁移
type walletAdressCoinNumber = {
    timestamp:number,
    coinNumber:number,
    done:boolean,
    params:{
        timestamp:number,
        height:number,
        nextBlockHash:string
    }
}
class WalletContoller extends baseContoller {
    walletAdressCoinNumberMap:Map<string,walletAdressCoinNumber>
    constructor() {
        super()
        this.walletAdressCoinNumberMap = new Map<string,walletAdressCoinNumber>()
    }
    getCoinNumber() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            const walletAdress = ctx.query.walletAdress
            const params = {
                timestamp:ctx.query.timestamp,
                nextBlockHash:ctx.query.nextBlockHash,
                height:ctx.query.height
            }
            if(this.walletAdressCoinNumberMap.has(walletAdress)) {
               const wacnObj =  this.walletAdressCoinNumberMap.get(walletAdress)
               wacnObj.timestamp = new Date().getTime()
               this.walletAdressCoinNumberMap.set(walletAdress,wacnObj)
               if(!wacnObj.done){
                return this.error(ctx,{},'WAIT_LOADING')
               }
               this.walletAdressCoinNumberMap.delete(walletAdress)
               return this.sucess(ctx,{
                coinNumber:wacnObj.coinNumber,
                params:wacnObj.params
               })
            }
            if(this.walletAdressCoinNumberMap.size>255) {
                return this.error(ctx,{},'WAIT_QUEUE')
            }
            this.walletAdressCoinNumberMap.set(walletAdress,{
                coinNumber: 0,
                timestamp:new Date().getTime(),
                params,
                done:false
            })
            return this.error(ctx,{},'WAIT_LOADING')
        }
    }
    runCoinNumberMap() {
        const timeout = 30*1000
        setInterval(async ()=>{
            const nowTime = new Date().getTime()
            for(const wacnObj of this.walletAdressCoinNumberMap) {
                if(wacnObj[1].timestamp<nowTime-timeout) {
                    this.walletAdressCoinNumberMap.delete(wacnObj[0])
                    continue;
                }
                if(wacnObj[1].done) {
                    continue;
                }
                const preGodBlock =  fitBlockCore.getPreGodBlock();
                preGodBlock.timestamp = wacnObj[1].params.timestamp
                preGodBlock.nextBlockHash = wacnObj[1].params.nextBlockHash
                preGodBlock.height = wacnObj[1].params.height
                const coinNumberData = await fitBlockCore.getCoinNumberyByWalletAdress(wacnObj[0],preGodBlock)
                coinNumberData.lastBlock = await blockServer.getReallyLastBlock(coinNumberData.lastBlock)
                wacnObj[1].coinNumber = coinNumberData.coinNumber
                wacnObj[1].params.timestamp = coinNumberData.lastBlock.timestamp
                wacnObj[1].params.nextBlockHash = coinNumberData.lastBlock.nextBlockHash
                wacnObj[1].params.height = coinNumberData.lastBlock.height
                wacnObj[1].done = true
                this.walletAdressCoinNumberMap.set(wacnObj[0],wacnObj[1])
            }
        },1000)
    }
    getTransactions() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            const walletAdress = ctx.query.walletAdress
            const limit = ctx.query.limit
            const preGodBlock =  fitBlockCore.getPreGodBlock();
            preGodBlock.timestamp = ctx.query.timestamp
            preGodBlock.nextBlockHash = ctx.query.nextBlockHash
            preGodBlock.height = ctx.query.height
            const data = await fitBlockCore.getTransactionsByWalletAdress(walletAdress, preGodBlock, limit)
            data.lastBlock = await blockServer.getReallyLastBlock(data.lastBlock)
            return this.sucess(ctx,{
                transactionList:data.transactions,
                params:{
                    timestamp:data.lastBlock.timestamp,
                    nextBlockHash:data.lastBlock.nextBlockHash,
                    height:data.lastBlock.height,
                }
               })
        }
    }
}
const walletContoller = new WalletContoller()
walletContoller.runCoinNumberMap();
export default walletContoller;