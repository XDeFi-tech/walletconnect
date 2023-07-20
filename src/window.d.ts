import { Window as KeplrWindow } from '@keplr-wallet/types'

declare global {
  interface Window extends KeplrWindow {
    ethereum: any
    BinanceChain: any
    web3: any
    celo: any
    xfi: any
    terraWallets: any[]
    keplr: any
  }
}
