export default {
    "trans.form.privateKey":"private key",
    "trans.form.privateKeyFormat":"must be 64 characters‘s hex number (Hash256)",
    "trans.form.inputPrivateKey":"input private key,please",
    "trans.form.accepterWalletAddress":"accepter wallet address",
    "trans.form.accepterWalletAddressFormat":"numbers and letters and length between 85 and 95,but remove 0,O,I,l.",
    "trans.form.inputAccepterWalletAddress":"input accepter wallet addres,please",
    "trans.form.volume":"volume",
    "trans.form.volumeFormat":"volume must be integer and lt 15 characters",
    "trans.form.inputVolume":"input volume,please",
    "trans.button.trade":"trade",
    "trans.title.transactionEntrustList":"Transaction Entrust List",
    "trans.error.TRANSACTION_NOT_VERIFY":"Transaction verify failed!",
    "wallet.text.transactionRecord":params=>{
        return `${params.sendAddress} at ${params.datetime} send to ${params.acceptAddress},
        volume:F${params.coinNumber}|status:${params.isComplete?'success':'pending'}`;
    },
}