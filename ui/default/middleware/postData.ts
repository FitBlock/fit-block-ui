import * as Koa from 'koa';
export default  async function getPostData(ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>,next) {
    let data=''
    for await (const chunk of ctx.req) {
            data += chunk;
    }
    ctx.post = {}
    if(data) {
        ctx.post = JSON.parse(data)
    }
    await next()
}