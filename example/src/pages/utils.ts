// import WalletConnect from '@walletconnect/web3-provider'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import Torus from '@toruslabs/torus-embed'
import Ledger from '@web3modal/ledger-provider'
import Trezor from '@web3modal/trezor-provider'
import { Web3Auth } from '@web3auth/web3auth'
import { IProviderOptions, injected } from '@xdefi/wallets-connector'

export const getProviderOptions = (): IProviderOptions => {
  const infuraId = '2d3d8075607640d4b88e2626f8c11ea7'
  const providerOptions = {
    xdefi: {},
    injected: {
      display: {
        ...injected.INJECTED
      }
    },
    metamask: {},
    opera: {},
    safe: {},
    cipher: {},

    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'WalletConnect Example App',
        infuraId
      }
    },
    web3auth: {
      package: Web3Auth,
      options: {
        infuraId
      }
    },
    walletconnect: {
      package: EthereumProvider,
      options: {
        projectId: '1950467c55f321300fc23ac1c0860041',
        chains: [1],
        showQrModal: true,
        metadata: {
          name: 'XDEFI Swap & Bridge',
          description: 'XDEFI Swap & Bridge',
          url: 'https://app.xdefi.io',
          icons: ['https://app.xdefi.io/logo192.png']
        }
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

export const CUSTOM_THEME_BUILDER = (darkMode: boolean): any => ({
  white: darkMode ? '#0969da' : '#9a6700',
  black: darkMode ? '#9a6700' : '#0969da',
  modal: {
    bg: darkMode ? '#2b2b2b' : '#E5E5E5',
    layoutBg: darkMode ? '#000000' : '#000000'
  },
  wallet: {
    name: darkMode ? '#9a6700' : '#333333',
    descColor: darkMode ? '#c4c4c4' : '#979797',
    titleColor: darkMode ? '#f2f1f1' : '#333333',
    bg: darkMode ? '#333333' : '#F2F1F1',
    activeBg: darkMode ? 'lightslategrey' : 'darkseagreen',
    disableText: '#ffc400',
    recommendedText: '#36b37e',
    connectedText: '#36b37e'
  },
  button: {
    color: '#fff',
    bg: '#4476F2',
    hover: '#0b1114',
    disabledColor: '#969da3',
    disabledBg: '#111314'
  },
  selectChain: {
    title: '#fff',
    deselectAll: '#9ecaff',
    description: '#969da3'
  }
})
