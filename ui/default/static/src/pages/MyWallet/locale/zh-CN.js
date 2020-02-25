export default {
    "wallet.button.switchPrivateKey":"切换私钥",
    "wallet.button.miningPool":"矿池挖矿",
    "wallet.button.transfer":"转账",
    "wallet.button.reloadBalance":"重新载入余额",
    "wallet.text.balance":"余额",
    "wallet.text.loading":"载入中...",
    "wallet.text.transactionsIsEmpty":"交易是空的.可能需要等待数据同步.",
    "wallet.title.walletAddress":"钱包地址",
    "wallet.title.transactionFlow":"交易流水",
    "wallet.button.getLastTransactionRecords":"获取最新交易记录",
    "wallet.text.onlyShowLastRecords":"本栏目只显示最新交易记录(如果你离开当前页面后)",
    "wallet.text.transactionRecord":params=>{
        return `${params.sendAddress}于${params.datetime}转账给${params.acceptAddress},
        交易量:F${params.coinNumber},手续费:F${params.tradingNumber}，实际到账:F${params.arriveNumber}`;
    },
}