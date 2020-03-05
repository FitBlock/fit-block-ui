import * as Koa from 'koa';
import fitBlockCore from 'fit-block-core'
import baseContoller from './base';
// 本来预计项目小，看来还是得要server层，现在有点凌乱了，下次迁移
class TransContoller extends baseContoller { 
    constructor() {
        super()
    }

    keepTrans() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            if(!ctx.post.transactionSign) {
                return this.error(ctx,{
                    transactionSign:ctx.post.transactionSign
                },'NEED_PARAMS')
            }
            const myStore = fitBlockCore.getStore()
            const transactionSign = myStore.getTransactionSignByStr(JSON.stringify(ctx.post.transactionSign))
            // // 性能耗费过大, 放到其它步骤
            // try {
            //     await fitBlockCore.acceptTransaction(transactionSign)
            // } catch(err) {
            //     return this.error(ctx,{
            //         transactionSign:ctx.post.transactionSign
            //     },'TRANSACTION_NOT_VERIFY')
            // }
            if(!transactionSign.verify()) {
                return this.error(ctx,{
                    transactionSign:ctx.post.transactionSign
                },'TRANSACTION_NOT_VERIFY')
            }
            const isKeep = await myStore.keepTransactionSignData(transactionSign)
            return this.sucess(ctx,{
                isKeep
            })
        }
    }

    checkIsTransInBlock() {
        return async (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            if(!ctx.post.transactionSign) {
                return this.error(ctx,{
                    transactionSign:ctx.post.transactionSign
                },'NEED_PARAMS')
            }
            if(!ctx.post.startBlock) {
                return this.error(ctx,{
                    startBlock:ctx.post.startBlock
                },'NEED_PARAMS')
            }
            const myStore = fitBlockCore.getStore()
            const transactionSign = myStore.getTransactionSignByStr(JSON.stringify(ctx.post.transactionSign))
            const startBlock = myStore.getBlockByStr(JSON.stringify(ctx.post.startBlock))
            const isInBlock = await myStore.checkIsTransactionSignInBlock(transactionSign, startBlock)
            let lastBlock = startBlock;
            for await (const block of await myStore.blockIterator(startBlock)) {
                lastBlock = block;
            }
            return this.sucess(ctx,{
                isInBlock,
                lastBlock
            })
        }
    }
}

const transContoller = new TransContoller()
export default transContoller;