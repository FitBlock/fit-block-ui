import UIBase from '../../types/UIBase';
import config from './config'
import * as Koa from 'koa';
import * as koaStatic from 'koa-static'
import router from './router'
import {join as pathJoin} from 'path'
import fitBlockStore from 'fit-block-store'
import postData from './middleware/postData'
import { Worker, isMainThread } from  'worker_threads'
// import fitBlockCore from 'fit-block-core'
import fitBlockP2p from 'fit-block-p2p'
export default class UIDefault extends UIBase {
    async start():Promise<void> {
        const storeServer = fitBlockStore.getServer();
        await storeServer.listen()
        // fitBlockCore.keepGodBlockData(await fitBlockCore.genGodBlock())
        if (isMainThread) {
            const worker = new Worker(__filename);
            worker.on('error', (err)=>{
                // todo 写入文件，在dev模式再显示控制台
            });
        } else {
            return await fitBlockP2p.run()
        }
        const app = new Koa();
        app.use(koaStatic(pathJoin(__dirname, 'static'),{index:'index.html'}));
        app.use(postData)
        app.use(router.routes())
        app.listen(config.port)
        console.log(`listening: http://127.0.0.1:${config.port}/`)
    }
}