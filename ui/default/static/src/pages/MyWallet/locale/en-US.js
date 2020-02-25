export default {
    "wallet.button.switchPrivateKey":"switch private key",
    "wallet.button.miningPool":"mining pool",
    "wallet.button.transfer":"transfer",
    "wallet.button.reloadBalance":"reload balance",
    "wallet.text.balance":"balance",
    "wallet.text.loading":"loading...",
    "wallet.text.transactionsIsEmpty":"transactions is empty.May be need wait data sync.",
    "wallet.title.walletAddress":"Wallet Address",
    "wallet.title.transactionFlow":"Transaction Flow",
    "wallet.button.getLastTransactionRecords":"get last transaction records",
    "wallet.text.onlyShowLastRecords":"only show last records(if you leave now tab)",
    "wallet.text.transactionRecord":params=>{
        return `${params.sendAddress} at ${params.datetime} send to ${params.acceptAddress},
        volume:F${params.coinNumber},fee:F${params.tradingNumber}，to account:F${params.arriveNumber}`;
    },
}