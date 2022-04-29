import { createContext } from 'react'
import WalletConnect from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'

import { Wallets } from './index'
import { WalletsConnector } from './WalletsConnector'
import { IProviderOptions } from './helpers'

const getProviderOptions = (): IProviderOptions => {
  const infuraId = 'blablaid'
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId,
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Coinbase Example App',
        infuraId,
      },
    },
  }
  return providerOptions
}

const connect = new WalletsConnector(getProviderOptions())

export const WalletsContext = createContext<WalletsConnector>(connect)

const NetworkManager = ({ children }: { children: JSX.Element }) => {
  return (
    <WalletsContext.Provider value={connect}>
      <Wallets />
      {children}
    </WalletsContext.Provider>
  )
}

export default NetworkManager
