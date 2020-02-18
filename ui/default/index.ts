import UIBase from '../../types/UIBase';
import config from './config'
import * as Koa from 'koa';
import * as koaStatic from 'koa-static'
import router from './router'
import {join as pathJoin} from 'path'
import fitBlockStore from 'fit-block-store'
export default class UIDefault extends UIBase {
    async start():Promise<void> {
        const storeServer = fitBlockStore.getServer();
        await storeServer.listen()
        const app = new Koa();
        app.use(koaStatic(pathJoin(__dirname, 'static'),{index:'index.html'}));
        app.use(router.routes())
        app.listen(config.port)
    }
}