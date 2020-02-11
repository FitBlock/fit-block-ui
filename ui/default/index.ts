import UIBase from '../../types/UIBase';
import config from './config'
import * as Koa from 'koa';
import * as koaStatic from 'koa-static'
import {join as pathJoin} from 'path'
export default class UIDefault extends UIBase {
    async start():Promise<void> {
        const app = new Koa();
        app.use(koaStatic(pathJoin(__dirname, 'static'),{index:'index.html'}));
        app.listen(config.port)
    }
}