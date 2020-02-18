export default {
    "wallet.button.switchPrivateKey":"切换私钥",
    "wallet.button.miningPool":"矿池挖矿",
    "wallet.button.transfer":"转账",
    "wallet.button.reloadBalance":"重新载入余额",
    "wallet.text.balance":"余额",
    "wallet.text.loading":"载入中...",
    "wallet.title.walletAddress":"钱包地址",
    "wallet.title.transactionFlow":"交易流水",
    "wallet.text.transactionRecord":params=>{
        return `${params.sendAddress} at ${params.datetime} send to ${params.acceptAddress},
        volume:F${params.coinNumber},fee:F${params.tradingNumber}，to account:F${params.arriveNumber}`;
    },
}