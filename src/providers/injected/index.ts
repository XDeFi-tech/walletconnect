import { IProviderInfo, findAvailableEthereumProvider } from '../../helpers'
import { IChainType, WALLETS } from '../../constants'
import { ReactComponent as Wallet } from '../../components/icons/Wallet.svg'
import { ReactComponent as MetaMaskLogo } from '../logos/metamask.svg'
import { ReactComponent as SafeLogo } from '../logos/safe.svg'
import { ReactComponent as TrustLogo } from '../logos/trust.svg'
import { ReactComponent as CoinbaseLogo } from '../logos/coinbase.svg'
import { ReactComponent as CipherLogo } from '../logos/cipher.svg'
import { ReactComponent as imTokenLogo } from '../logos/imtoken.svg'
import { ReactComponent as StatusLogo } from '../logos/status.svg'
import { ReactComponent as OperaLogo } from '../logos/opera.svg'
import { ReactComponent as FrameLogo } from '../logos/frame.svg'
import { ReactComponent as BoltXLogo } from '../logos/boltx.svg'
import { ReactComponent as RWalletLogo } from '../logos/rwallet.svg'
import { ReactComponent as BitpieLogo } from '../logos/bitpie.svg'
import { ReactComponent as XDEFILogo } from '../logos/xdefi.svg'
import { ReactComponent as CeloExtensionWalletLogo } from '../logos/celoExtensionWallet.svg'
import { ReactComponent as BlockWalletLogo } from '../logos/blockwallet.svg'
import { ReactComponent as TallyLogo } from '../logos/tally.svg'
import { ReactComponent as PortalLogo } from '../logos/portal.svg'
import { ReactComponent as SequenceLogo } from '../logos/sequence.svg'
import { ReactComponent as BraveLogo } from '../logos/brave.svg'
import { ReactComponent as RabbyLogo } from '../logos/rabby.svg'
import { ReactComponent as CtrlLogo } from '../logos/ctrl.svg'

export const INJECTED: IProviderInfo = {
  id: 'injected',
  name: 'Browser Wallet',
  logo: Wallet,
  type: 'injected',
  check: 'isWeb3',
  getEthereumProvider: () => {
    return findAvailableEthereumProvider()
  }
}

export const METAMASK: IProviderInfo = {
  id: WALLETS.metamask,
  name: 'MetaMask',
  logo: MetaMaskLogo,
  type: 'injected',
  check: 'isMetaMask',
  installationLink: 'https://metamask.io'
}

export const SAFE: IProviderInfo = {
  id: 'injected',
  name: 'Safe',
  logo: SafeLogo,
  type: 'injected',
  check: 'isSafe'
}

export const OPERA: IProviderInfo = {
  id: 'injected',
  name: 'Opera',
  logo: OperaLogo,
  type: 'injected',
  check: 'isOpera'
}

export const TRUST: IProviderInfo = {
  id: 'injected',
  name: 'Trust',
  logo: TrustLogo,
  type: 'injected',
  check: 'isTrust'
}

export const COINBASE: IProviderInfo = {
  id: 'injected',
  name: 'Coinbase',
  logo: CoinbaseLogo,
  type: 'injected',
  check: 'isCoinbaseWallet'
}

export const CIPHER: IProviderInfo = {
  id: 'injected',
  name: 'Cipher',
  logo: CipherLogo,
  type: 'injected',
  check: 'isCipher'
}

export const IMTOKEN: IProviderInfo = {
  id: 'injected',
  name: 'imToken',
  logo: imTokenLogo,
  type: 'injected',
  check: 'isImToken'
}

export const STATUS: IProviderInfo = {
  id: 'injected',
  name: 'Status',
  logo: StatusLogo,
  type: 'injected',
  check: 'isStatus'
}

export const FRAMEINJECTED: IProviderInfo = {
  id: 'injected',
  name: 'Frame',
  logo: FrameLogo,
  type: 'injected',
  check: 'isFrame'
}

export const BOLTX: IProviderInfo = {
  id: 'boltx',
  name: 'Bolt-X',
  logo: BoltXLogo,
  type: 'injected',
  check: 'isBoltX'
}

export const RWALLET: IProviderInfo = {
  id: 'injected',
  name: 'rWallet',
  logo: RWalletLogo,
  type: 'injected',
  check: 'isRWallet'
}

const EVM_TEMPLATE = {
  methods: {
    getProvider: () => window.xfi.ethereum,
    getAccounts: () => {
      return window.xfi.ethereum.request({
        method: 'eth_requestAccounts',
        params: []
      })
    },
    request: (method: string, data: any) => {
      return window.xfi.ethereum.request({ method: method, params: data })
    }
  }
}

const getCosmosTemplate = (chainId: string) => ({
  methods: {
    getAccounts: () => {
      return new Promise((resolve, reject) => {
        return window.xfi.keplr
          .enable(chainId)
          .then(() => {
            return window.xfi.keplr.getOfflineSigner(chainId).getAccounts()
          })
          .then((accounts: any) => {
            resolve(accounts.map((addressItem: any) => addressItem.address))
          })
          .catch((e: any) => {
            return reject(e)
          })
      })
    },

    request: (method: string, data: any) => {
      if (method === 'getKey') {
        return new Promise((resolve, reject) => {
          return window.xfi.keplr
            .getKey(data)
            .then((result: any) => {
              resolve(result)
            })
            .catch((e: any) => {
              return reject(e)
            })
        })
      }

      if (method === 'getSigner') {
        return new Promise((resolve, reject) => {
          const signer = window.xfi.keplr.getOfflineSigner?.(chainId)
          if (signer) {
            resolve(signer)
          } else {
            reject(new Error('keplr is not enabled'))
          }
        })
      }
      if (method === 'sendTx') {
        return new Promise((resolve, reject) => {
          window.xfi.keplr
            .sendTx?.(chainId, data.tx, data.mode)
            .then(resolve)
            .catch(reject)
        })
      }
      return new Promise(() => null)
    }
  }
})

export const XDEFI: IProviderInfo = {
  id: WALLETS.xdefi,
  name: 'XDEFI',
  logo: XDEFILogo,
  type: 'injected',
  check: (provider) => {
    return !!provider.__XDEFI && !provider.__CTRL
  },
  installationLink: 'https://xdefi.io',
  getEthereumProvider: () => {
    return window.xfi ? window.xfi.ethereum : undefined
  },

  chains: {
    [IChainType.bitcoin]: {
      methods: {
        getProvider: () => window.xfi.bitcoin,
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            window.xfi.bitcoin.request(
              { method: 'request_accounts', params: [] },
              (error: any, accounts: any) => {
                if (error) {
                  reject(error)
                }

                resolve(accounts)
              }
            )
          })
        },
        signTransaction: (hash: string) => {
          return new Promise((resolve, reject) => {
            window.xfi.bitcoin.request(
              { method: 'sign_transaction', params: [hash] },
              (error: any, result: any) => {
                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
          })
        },
        request: (method: string, data: any) => {
          return new Promise((resolve, reject) => {
            window.xfi.bitcoin.request(
              { method: method, params: data },
              (error: any, result: any) => {
                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
          })
        }
      }
    },
    [IChainType.thorchain]: {
      methods: {
        getProvider: () => window.xfi.thorchain,
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            window.xfi.thorchain.request(
              { method: 'request_accounts', params: [] },
              (error: any, accounts: any) => {
                if (error) {
                  reject(error)
                }

                resolve(accounts)
              }
            )
          })
        },
        request: (method: string, data: any) => {
          return new Promise((resolve, reject) => {
            window.xfi.thorchain.request(
              { method: method, params: data },
              (error: any, result: any) => {
                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
          })
        }
      }
    },
    [IChainType.solana]: {
      methods: {
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            return window.xfi.solana
              .request('connect', [])
              .then((accounts: any) => {
                resolve(accounts)
              })
              .catch((e: any) => {
                return reject(e)
              })
          })
        },
        request: (method: string, data: any) => {
          return new Promise((resolve, reject) => {
            if (method === 'signTransaction') {
              return window.xfi.solana
                .signTransaction(...data)
                .then((result: any) => {
                  resolve(result)
                })
                .catch((e: any) => {
                  return reject(e)
                })
            }
            return window.xfi.solana
              .request(method, data)
              .then((result: any) => {
                resolve(result)
              })
              .catch((e: any) => {
                return reject(e)
              })
          })
        }
      }
    },
    [IChainType.cosmos]: getCosmosTemplate('cosmoshub-4'),
    [IChainType.osmosis]: getCosmosTemplate('osmosis-1'),
    [IChainType.axelar]: getCosmosTemplate('axelar-dojo-1'),
    [IChainType.stargaze]: getCosmosTemplate('stargaze-1'),
    [IChainType.kujira]: getCosmosTemplate('kaiyo-1'),
    // [IChainType.kava]: getCosmosTemplate('kava_2222-10'),
    // [IChainType.akash]: getCosmosTemplate('akashnet-2'),
    // [IChainType.cronos]: getCosmosTemplate('crypto-org-chain-mainnet-1'),
    // [IChainType.stride]: getCosmosTemplate('stride-1'),
    // [IChainType.mars]: getCosmosTemplate('mars-1'),
    [IChainType.litecoin]: {
      methods: {
        getProvider: () => window.xfi.litecoin,
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            window.xfi.litecoin.request(
              { method: 'request_accounts', params: [] },
              (error: any, accounts: any) => {
                if (error) {
                  reject(error)
                }

                resolve(accounts)
              }
            )
          })
        },
        request: (method: string, data: any) => {
          return new Promise((resolve, reject) => {
            window.xfi.litecoin.request(
              { method: method, params: data },
              (error: any, result: any) => {
                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
          })
        }
      }
    },
    [IChainType.bitcoincash]: {
      methods: {
        getProvider: () => window.xfi.bitcoincash,
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            window.xfi.bitcoincash.request(
              { method: 'request_accounts', params: [] },
              (error: any, accounts: any) => {
                if (error) {
                  reject(error)
                }

                resolve(accounts)
              }
            )
          })
        },
        request: (method: string, data: any) => {
          return new Promise((resolve, reject) => {
            window.xfi.bitcoincash.request(
              { method: method, params: data },
              (error: any, result: any) => {
                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
          })
        }
      }
    },
    [IChainType.dogecoin]: {
      methods: {
        getProvider: () => window.xfi.dogecoin,
        getAccounts: () => {
          return new Promise((resolve, reject) => {
            if (!window.xfi.dogecoin) {
              resolve([])
              return
            }

            window.xfi.dogecoin.request(
              { method: 'request_accounts', params: [] },
              (error: any, accounts: any) => {
                if (error) {
                  reject(error)
                }

                resolve(accounts)
              }
            )
          })
        },
        request: (method: string, data: any) => {
          return new Promise((resolve, reject) => {
            window.xfi.dogecoin.request(
              { method: method, params: data },
              (error: any, result: any) => {
                if (error) {
                  reject(error)
                }

                resolve(result)
              }
            )
          })
        }
      }
    },
    [IChainType.ethereum]: EVM_TEMPLATE,
    [IChainType.binancesmartchain]: EVM_TEMPLATE,
    [IChainType.arbitrum]: EVM_TEMPLATE,
    [IChainType.avalanche]: EVM_TEMPLATE,
    [IChainType.polygon]: EVM_TEMPLATE,
    [IChainType.fantom]: EVM_TEMPLATE,
    [IChainType.optimism]: EVM_TEMPLATE
  }
}

export const CTRL: IProviderInfo = {
  ...XDEFI,
  name: 'Ctrl',
  logo: CtrlLogo,
  type: 'injected',
  check: '__CTRL',
  installationLink: 'https://ctrl.xyz'
}

export const BITPIE: IProviderInfo = {
  id: 'injected',
  name: 'Bitpie',
  logo: BitpieLogo,
  type: 'injected',
  check: 'isBitpie'
}

export const CELOINJECTED: IProviderInfo = {
  id: 'injected',
  name: 'Celo extension wallet',
  logo: CeloExtensionWalletLogo,
  type: 'injected',
  check: 'isCelo'
}

export const BLOCKWALLET: IProviderInfo = {
  id: 'injected',
  name: 'BlockWallet',
  logo: BlockWalletLogo,
  type: 'injected',
  check: 'isBlockWallet'
}

export const TALLYINJECTED: IProviderInfo = {
  id: 'injected',
  name: 'Tally',
  logo: TallyLogo,
  type: 'injected',
  check: 'isTally'
}

export const PORTAL: IProviderInfo = {
  id: 'injected',
  name: 'Ripio Portal',
  logo: PortalLogo,
  type: 'injected',
  check: 'isPortal'
}

export const SEQUENCEINJECTED: IProviderInfo = {
  id: 'injected',
  name: 'Sequence',
  logo: SequenceLogo,
  type: 'injected',
  check: 'isSequence'
}

export const RABBY: IProviderInfo = {
  id: 'injected',
  name: 'Rabby',
  logo: RabbyLogo,
  type: 'injected',
  check: 'isRabby'
}

export const BRAVE: IProviderInfo = {
  id: 'injected',
  name: 'Brave',
  logo: BraveLogo,
  type: 'injected',
  check: 'isBraveWallet'
}
