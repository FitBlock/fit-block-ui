import UIBase from '../../types/UIBase';
import config from './config'
import * as Koa from 'koa';
import * as koaStatic from 'koa-static'
import router from './router'
import {join as pathJoin} from 'path'
import fitBlockStore from 'fit-block-store'
import postData from './middleware/postData'
import fitBlockCore from 'fit-block-core'
import fitBlockP2p from 'fit-block-p2p'
export default class UIDefault extends UIBase {
    async start():Promise<void> {
        const storeServer = fitBlockStore.getServer();
        await storeServer.listen()
        // fitBlockCore.keepGodBlockData(await fitBlockCore.genGodBlock())
        /**
         * fitBlockP2p.run不要加await，这里作为后台任务
         * 原来这里使用了worker多线程，但是grpc只要在多线程使用会报C++模块引用失败Error:Module did not self-register.
         * 导致p2p服务没有真正启动，现在先考虑修复方案
         * 具体可参考：
         * https://github.com/grpc/grpc-node/issues/778
         */
        fitBlockP2p.run()
        const app = new Koa();
        app.use(koaStatic(pathJoin(__dirname, 'static'),{index:'index.html'}));
        app.use(postData)
        app.use(router.routes())
        app.listen(config.port)
        console.log(`listening: http://127.0.0.1:${config.port}/`)
    }
}