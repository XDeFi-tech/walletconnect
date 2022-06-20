import React, { useState } from 'react'
import WalletConnect from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Torus from '@toruslabs/torus-embed'
import Ledger from '@web3modal/ledger-provider'
import Trezor from '@web3modal/trezor-provider'
import NetworkManager, {
  IProviderOptions,
  injected,
  connectors
} from '@xdefi/wallets-connector'

import MyApp from './MyApp'

const getProviderOptions = (): IProviderOptions => {
  const infuraId = 'blablaid'
  const providerOptions = {
    xdefi: {
      package: true,
      connector: connectors.injected,
      display: injected.XDEFI
    },
    injected: {
      package: true,
      connector: connectors.injected,
      display: {
        ...injected.FALLBACK,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Circle-icons-gamecontroller.svg/2048px-Circle-icons-gamecontroller.svg.png'
      }
    },
    metamask: {
      package: true,
      connector: connectors.injected,
      display: injected.METAMASK
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Coinbase Example App',
        infuraId
      }
    },
    torus: {
      package: Torus
    },
    ledger: {
      package: Ledger
    },
    trezor: {
      package: Trezor
    }
  }
  return providerOptions
}

function App() {
  const [options] = useState(() => getProviderOptions())

  return (
    <NetworkManager options={options} network='mainnet' cacheEnabled={true}>
      <MyApp />
    </NetworkManager>
  )
}

export default App
