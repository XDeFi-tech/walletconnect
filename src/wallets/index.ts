import {
  canInject,
  IChainToAccounts,
  IChainWithAccount,
  IProviderOptions,
  SimpleFunction
} from '../helpers'
import { IChainType, WALLETS_EVENTS } from '../constants'
import { WalletConnect } from '../core'

const INIT_RETRY_TIMEOUT = 300

export class WalletsConnector {
  public connector: WalletConnect
  public currentProvider: any
  private accounts: IChainWithAccount | null = null
  private timeoutId: ReturnType<typeof setTimeout>

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

    this.init()
  }

  private init() {
    if (canInject()) {
      this.connect()
    } else {
      this.timeoutId = setTimeout(() => this.init(), INIT_RETRY_TIMEOUT)
    }
  }

  public dispose = () => {
    clearTimeout(this.timeoutId)
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.loadAccounts)
      window.ethereum.removeListener('disconnect', this.disconnect)
    }
  }

  private connect = async () => {
    try {
      this.connector.init()

      const provider = await this.connector
        .connect()
        .then((provider: any) => {
          return provider && provider.enable()
        })
        .catch((e) => {
          console.warn('Error', e)
        })

      if (!provider) {
        this.timeoutId = setTimeout(() => this.connect(), INIT_RETRY_TIMEOUT)
      } else {
        const ethereum = window.ethereum

        if (ethereum) {
          ethereum.on('accountsChanged', this.loadAccounts)
          ethereum.on('disconnect', this.disconnect)
        }
      }
    } catch (e) {
      console.log('Error', e)

      this.timeoutId = setTimeout(() => this.connect(), INIT_RETRY_TIMEOUT)
    }
  }

  private loadAccounts = async () => {
    if (!canInject()) {
      return
    }

    const ethAccounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    })
    const accounts = await this.connector.loadAccounts()

    const map = accounts
      ? accounts.reduce(
          (acc: Record<string, string>, item: IChainToAccounts) => {
            acc[item.chain] = item.account
            return acc
          },
          {}
        )
      : {}

    map[IChainType.ethereum] = ethAccounts

    const evmChainsAvailable =
      this.connector.injectedProvider?.supportedEvmChains

    if (evmChainsAvailable) {
      evmChainsAvailable.forEach((chain) => {
        map[chain] = ethAccounts
      })
    }

    this.setAccounts(map)
  }

  private setAccounts = (map: IChainWithAccount | null) => {
    this.accounts = map
    this.connector.trigger(WALLETS_EVENTS.ACCOUNTS, this.accounts)
  }

  public disconnect = () => {
    this.connector.clearCachedProvider()

    this.setAccounts(null)
  }

  public getChainMethods = (chain: IChainType) => {
    const chains = this.connector.injectedProvider?.chains
    return chains ? chains[chain] : undefined
  }

  public signMessage = async (chainId: IChainType, data: any) => {
    if (!canInject()) {
      return
    }

    switch (chainId) {
      case IChainType.ethereum: {
        return window.ethereum.request({
          method: 'eth_sign',
          params: data
        })
      }

      default: {
        const targetProvider = this.getChainMethods(chainId)
        if (targetProvider && targetProvider.methods.signTransaction) {
          return targetProvider.methods.signTransaction(data)
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

  public isRequestAvailable = (chainId: IChainType) => {
    const targetProvider = this.getChainMethods(chainId)

    return (
      targetProvider &&
      targetProvider.methods &&
      !!targetProvider.methods.request
    )
  }

  public request = async (chainId: IChainType, method: string, data: any) => {
    const targetProvider = this.getChainMethods(chainId)

    if (targetProvider && targetProvider.methods.request) {
      return targetProvider.methods.request(method, data)
    }

    switch (chainId) {
      case IChainType.ethereum: {
        return window.ethereum.request({
          method: method,
          params: data
        })
      }
    }

    throw new Error(`Not supported ${method} for ${chainId}`)
  }

  public on = (event: string, callback: SimpleFunction) => {
    this.connector.on(event, callback)
  }

  public off(event: string, callback?: SimpleFunction): void {
    this.connector.off(event, callback)
  }

  public getAccounts = (): IChainWithAccount | null => {
    return this.accounts
  }

  private fireConfigs = async (provider: any = undefined) => {
    if (provider) {
      this.currentProvider = provider
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
