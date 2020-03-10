import baseServer from './base';
import fitBlockCore from 'fit-block-core'
class TransServer extends baseServer {
    async getLastTrans() {
        const transactionSignList = []
        const myStore = fitBlockCore.getStore()
        for await(const transactionSign of await myStore.transactionSignIterator()) {
            transactionSignList.push(transactionSign)
        }
        return transactionSignList
    }
}

const transServer = new TransServer()
export default transServer;
