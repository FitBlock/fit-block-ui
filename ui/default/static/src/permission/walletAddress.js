import config from '@/config'
class WalletAdress {
    checkWalletAdress() {
        const walletAdress = window.localStorage.getItem(config.walletAdressKey)
        if(!walletAdress) {
            window.location.hash=""
        }
    }
}
export default new WalletAdress()