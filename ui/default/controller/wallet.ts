import * as Koa from 'koa';
class WalletContoller {
    hello() {
        return (ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>)=>{
            ctx.body = 'hello wallet'
        }
    }
}
export default new WalletContoller()