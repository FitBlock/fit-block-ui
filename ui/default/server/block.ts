import baseServer from './base';
import fitBlockCore from 'fit-block-core'
class BlockServer extends baseServer {
    async getLastBlock(startBlock=fitBlockCore.getPreGodBlock()) {
        const myStore = fitBlockCore.getStore()
        startBlock = myStore.getBlockByStr(JSON.stringify(startBlock))
        let lastBlock = startBlock;
        for await (const block of await myStore.blockIterator(startBlock)) {
            lastBlock = block;
        }
        return lastBlock
    }

    async getReallyLastBlock(lastBlock=fitBlockCore.getPreGodBlock()) {
        const preGodBlock =  fitBlockCore.getPreGodBlock();
        if(lastBlock.height === preGodBlock.height) {
            return await this.getLastBlock(lastBlock)
        }
        return lastBlock
    }
}

const blockServer = new BlockServer()
export default blockServer;
