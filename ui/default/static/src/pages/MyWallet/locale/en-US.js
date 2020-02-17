export default {
    "wallet.button.switchPrivateKey":"switch private key",
    "wallet.button.miningPool":"mining pool",
    "wallet.button.transfer":"transfer",
    "wallet.text.balance":"balance",
    "wallet.text.loading":"loading...",
    "wallet.title.walletAddress":"Wallet Address",
    "wallet.title.transactionFlow":"Transaction Flow",
    "wallet.text.transactionRecord":params=>{
        return `${params.sendAddress}于${params.datetime}转账给${params.acceptAddress},
        交易量:F${params.coinNumber},手续费:F${params.tradingNumber}，实际到账:F${params.arriveNumber}`;
    },
}