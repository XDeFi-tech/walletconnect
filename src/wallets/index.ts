import {
  IChainToAccounts,
  IChainWithAccount,
  IProviderOptions,
  SimpleFunction
} from '../helpers'
import { IChainType, WALLETS_EVENTS } from '../constants'
import { WalletConnect } from '../core'
import { isEqual } from 'lodash'

export class WalletsConnector {
  public connector: WalletConnect
  private accounts: IChainWithAccount = {}

  constructor(
    providerOptions: IProviderOptions,
    network = 'mainnet',
    cacheProvider = true
  ) {
    const connector = new WalletConnect({
      network,
      cacheProvider,
      providerOptions
    })

    this.connector = connector

    this.connector.on(WALLETS_EVENTS.CONNECT, (provider) =>
      this.fireConfigs(provider)
    )

    this.connect()
  }

  private connect = async () => {
    try {
      const provider = this.connector.connect().then((provider: any) => {
        return provider && provider.enable()
      })

      if (!provider) {
        setTimeout(() => this.connect(), 1000)
      } else {
        const ethereum = window.ethereum

        if (ethereum) {
          ethereum.on('accountsChanged', () => {
            this.loadAccounts()
          })
          ethereum.on('disconnect', () => {
            this.disconnect()
          })
        }
      }
    } catch (e) {
      console.log('Error', e)

      setTimeout(() => this.connect(), 1000)
    }
  }

  private loadAccounts = async () => {
    if (!window.ethereum) {
      return
    }

    const ethAccounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    const accounts = await this.connector.loadAccounts()

    const map = accounts.reduce((acc: any, item: IChainToAccounts) => {
      acc[item.chain] = item.account
      return acc
    }, {})

    map[IChainType.ethereum] = ethAccounts[0]

    const evmChainsAvailable =
      this.connector.injectedProvider?.supportedEvmChains

    if (evmChainsAvailable) {
      evmChainsAvailable.forEach((chain) => {
        map[chain] = ethAccounts[0]
      })
    }

    this.setAccounts(map)
  }

  private setAccounts = (map: IChainWithAccount) => {
    if (!isEqual(this.accounts, map)) {
      this.accounts = map
      this.connector.trigger(WALLETS_EVENTS.ACCOUNTS, this.accounts)
    }
  }

  public getBalance = async (chain: IChainType = IChainType.ethereum) => {
    if (!window.ethereum) {
      return '0'
    }

    if (this.accounts[chain] && chain === IChainType.ethereum) {
      return window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [this.accounts[chain] as string]
      })
    }

    console.log(`Not supported chain ${chain} for loading balance`)
    return '0'
  }

  public disconnect = () => {
    this.connector.clearCachedProvider()

    this.setAccounts({})
  }

  public getChainMethods = (chain: IChainType) => {
    const chains = this.connector.injectedProvider?.chains
    return chains ? chains[chain] : undefined
  }

  public signTransaction = async (
    chainId: IChainType,
    transactionParams: Record<string, string | number>
  ) => {
    if (!window.ethereum) {
      return
    }

    switch (chainId) {
      case IChainType.ethereum: {
        return await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParams]
        })
      }

      default: {
        const targetProvider = this.getChainMethods(chainId)
        if (targetProvider && targetProvider.methods.signTransaction) {
          return await targetProvider.methods.signTransaction(transactionParams)
        }
      }
    }
  }

  public isSignAvailable = (chainId: IChainType) => {
    switch (chainId) {
      case IChainType.ethereum: {
        return true
      }

      default: {
        const targetProvider = this.getChainMethods(chainId)
        if (targetProvider && targetProvider.methods.signTransaction) {
          return !!targetProvider.methods.signTransaction
        }
      }
    }

    return false
  }

  public request = async (chainId: IChainType, type: string, data: any) => {
    const targetProvider = this.getChainMethods(chainId)

    if (targetProvider && targetProvider.methods.request) {
      return await targetProvider.methods.request(type, data)
    }

    throw new Error(`Not supported ${type} for ${chainId}`)
  }

  public on = (event: string, callback: SimpleFunction) => {
    this.connector.on(event, callback)
  }

  public off(event: string, callback?: SimpleFunction): void {
    this.connector.off(event, callback)
  }

  public getAccounts = (): IChainWithAccount => {
    return this.accounts
  }

  private fireConfigs = async (provider: any = undefined) => {
    console.log('fireConfigs', provider)
    if (provider) {
      this.connector.trigger(WALLETS_EVENTS.CURRENT_PROVIDER, provider)
    }

    this.connector.trigger(
      WALLETS_EVENTS.CURRENT_WALLET,
      this.connector.injectedProvider
    )

    this.connector.trigger(
      WALLETS_EVENTS.CONNECTED_CHAINS,
      this.connector.injectedChains
    )

    return await this.loadAccounts()
  }
}
