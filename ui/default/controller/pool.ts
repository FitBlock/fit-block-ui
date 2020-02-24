import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
class PoolContoller extends baseContoller { 
    poolAddressInfo:{poolAddress:string,nowBlock:any,miningCoin:number};
    constructor() {
        super()
        this.poolAddressInfo = {
            poolAddress: fitBlockCore.getConfig().selfWalletAdress,
            nowBlock:fitBlockCore.getPreGodBlock(),
            miningCoin:0
        }
    }
    getPoolAddressInfo() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            return this.sucess(ctx,this.poolAddressInfo)
        }
    }
    runPoolAddressInfo() {
        setInterval(async ()=>{
            const miningData = await fitBlockCore.getMiningCoinNumberyByWalletAdress(
                this.poolAddressInfo.poolAddress,
                this.poolAddressInfo.nowBlock
            )
            this.poolAddressInfo.miningCoin+=miningData.coinNumber;
            this.poolAddressInfo.nowBlock = miningData.lastBlock
        },60*1000)
    }
}

const poolContoller = new PoolContoller()
poolContoller.runPoolAddressInfo()
export default poolContoller;