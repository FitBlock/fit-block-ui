import * as Router from 'koa-router'
import walletContoller from './controller/wallet'
import poolContoller from './controller/pool'
const router = new Router({
    prefix: '/api'
  })
// 轮询是否获取真正币量
router.get('/wallet/getCoinNumber',walletContoller.getCoinNumber())
// 根据地址获取最新数条交易
router.get('/wallet/getTransactions',walletContoller.getTransactions())
// 获取矿池数据
router.get('/pool/getPoolAddressInfo',poolContoller.getPoolAddressInfo())
export default router