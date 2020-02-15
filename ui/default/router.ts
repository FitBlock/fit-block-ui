import * as Router from 'koa-router'
import walletContoller from './controller/wallet'
const router = new Router({
    prefix: '/api'
  })
router.get('/wallet/hello',walletContoller.hello())
export default router