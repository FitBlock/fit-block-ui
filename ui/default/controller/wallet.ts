import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
type walletAdressCoinNumber = {
    timestamp:number,
    coinNumber:number,
    done:boolean,
    params:{
        timestamp:number,
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
                nextBlockHash:ctx.query.nextBlockHash
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
                const preGodBlock =  fitBlockCore.getPreGodBlock();
                preGodBlock.timestamp = wacnObj[1].params.timestamp
                preGodBlock.nextBlockHash = wacnObj[1].params.nextBlockHash
                const coinNumberData = await fitBlockCore.getCoinNumberyByWalletAdress(wacnObj[0],preGodBlock)
                wacnObj[1].coinNumber = coinNumberData.coinNumber
                wacnObj[1].params.timestamp = coinNumberData.lastBlock.timestamp
                wacnObj[1].params.nextBlockHash = coinNumberData.lastBlock.nextBlockHash
                wacnObj[1].done = true
                this.walletAdressCoinNumberMap.set(wacnObj[0],wacnObj[1])
            }
        },1000)
    }
}
const walletContoller = new WalletContoller()
walletContoller.runCoinNumberMap();
export default walletContoller;