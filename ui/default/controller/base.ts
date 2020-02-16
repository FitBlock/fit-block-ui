import * as Koa from 'koa';
export default abstract class BaseContoller {
    sucess(ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,data:any={}) {
        ctx.body = {
            error:0,
            data
        }
    }
    error(ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
        data:any={},
        errorCode:number,
        httpCode:500) {
        ctx.status = httpCode
        ctx.body = {
            error:errorCode,
            data
        }
    }
}