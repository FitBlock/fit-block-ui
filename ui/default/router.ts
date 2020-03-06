import * as Router from 'koa-router'
import walletContoller from './controller/wallet'
import poolContoller from './controller/pool'
import transContoller from './controller/trans'
const router = new Router({
    prefix: '/api'
  })
// 轮询是否获取真正币量
router.get('/wallet/getCoinNumber',walletContoller.getCoinNumber())
// 根据地址获取最新数条交易
router.get('/wallet/getTransactions',walletContoller.getTransactions())
// 获取矿池数据
router.get('/pool/getPoolAddressInfo',poolContoller.getPoolAddressInfo())
// 获取在线人数并刷在线时间
router.get('/pool/getOnlinePeople',poolContoller.getOnlinePeople())
// 申请挖矿数据段
router.get('/pool/applyMiningQuota',poolContoller.applyMiningQuota())
// 客户端挖取一个新的区块
router.post('/pool/acceptMiningBlock',poolContoller.acceptMiningBlock())
// 保存交易
router.post('/trans/keepTrans',transContoller.keepTrans())
// 检测交易是否成功
router.post('/trans/checkIsTransInBlock',transContoller.checkIsTransInBlock())
// 更新后获取最新区块
router.post('/trans/getLastBlock',transContoller.getLastBlock())
export default router