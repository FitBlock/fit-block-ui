export default {
    "trans.form.privateKey":"私钥",
    "home.form.privateKeyFormat":"必须为64位的16进制数(Hash256)",
    "trans.form.inputPrivateKey":"请输入私钥",
    "trans.form.accepterWalletAddress":"接受者钱包地址",
    "trans.form.accepterWalletAddressFormat":"数字和字母组成长度在85到95之间但去除0,O,I,l",
    "trans.form.inputAccepterWalletAddress":"请输入接受者钱包地址",
    "trans.form.volume":"交易量",
    "trans.form.volumeFormat":"交易量必须为整数并且小于15位",
    "trans.form.inputVolume":"请输入交易量",
    "trans.button.trade":"交易",
    "trans.title.transactionEntrustList":"交易委托列表",
    "trans.error.TRANSACTION_NOT_VERIFY":"交易校验失败!",
    "trans.text.transactionRecord":params=>{
        return `${params.sendAddress}于${params.datetime}转账给${params.acceptAddress}
        交易量:F${params.coinNumber}|状态:${params.isComplete?'交易成功':'交易中'}`;
    },
    "trans.button.backWallet":"返回钱包",
}