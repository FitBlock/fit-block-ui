import * as Router from 'koa-router'
import walletContoller from './controller/wallet'
const router = new Router({
    prefix: '/api'
  })
// 轮询是否获取真正币量
router.get('/wallet/getCoinNumber',walletContoller.getCoinNumber())
// 根据地址获取最新数条交易
router.get('/wallet/getTransactions',walletContoller.getTransactions())
export default router