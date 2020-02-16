import * as Router from 'koa-router'
import walletContoller from './controller/wallet'
const router = new Router({
    prefix: '/api'
  })
// 轮询是否获取真正币量
router.get('/wallet/getCoinNumber',walletContoller.getCoinNumber())
export default router