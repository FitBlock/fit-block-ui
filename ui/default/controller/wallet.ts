import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
type walletAdressCoinNumber = {timestamp:number,coinNumber:number}
class WalletContoller extends baseContoller {
    walletAdressCoinNumberMap:Map<string,walletAdressCoinNumber>
    constructor() {
        super()
        this.walletAdressCoinNumberMap = new Map<string,walletAdressCoinNumber>()
    }
    getCoinNumber() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            const walletAdress = ctx.query.walletAdress
            if(this.walletAdressCoinNumberMap.has(walletAdress)) {
               const wacnObj =  this.walletAdressCoinNumberMap.get(walletAdress)
               wacnObj.timestamp = new Date().getTime()
               this.walletAdressCoinNumberMap.set(walletAdress,wacnObj)
               return this.sucess(ctx,{
                    coinNumber:wacnObj.coinNumber
               })
            }
            if(this.walletAdressCoinNumberMap.size>255) {
                return this.sucess(ctx,{
                    coinNumber:-2
               })
            }
            this.walletAdressCoinNumberMap.set(walletAdress,{
                coinNumber: -1,
                timestamp:new Date().getTime()
            })
            return this.sucess(ctx,{
                coinNumber:-1
           })
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
                const coinNumber = await fitBlockCore.getCoinNumberyByWalletAdress(wacnObj[0])
                wacnObj[1].coinNumber = coinNumber
                this.walletAdressCoinNumberMap.set(wacnObj[0],wacnObj[1])
            }
        },1000)
    }
}
const walletContoller = new WalletContoller()
walletContoller.runCoinNumberMap();
export default walletContoller;