import * as React from 'react'
import { useState } from 'react'
import WalletConnect from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import NetworkManager, { IProviderOptions } from 'wallets-connector'

import MyApp from './MyApp'

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

function App() {
  const [options] = useState(() => getProviderOptions())
  return (
    <NetworkManager options={options} network="mainnet" cacheEnabled={true}>
      <MyApp />
    </NetworkManager>
  )
}

export default App
