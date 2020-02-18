import * as Koa from 'koa';
export default abstract class BaseContoller {
    sucess(ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,data:any={}) {
        ctx.body = {
            errorCode:'',
            data
        }
    }
    error(ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,
        data:any={},
        errorCode:string,
        httpCode:number = 200) {
        ctx.status = httpCode
        ctx.body = {
            errorCode,
            data
        }
    }
}