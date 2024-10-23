import {
  CHAIN_DATA_LIST,
  IChainToAccounts,
  IChainWithAccount,
  IConnectEventPayload,
  IConnectorOptions,
  IProviderConfigs,
  IProviderOptions,
  IProviderWithAccounts,
  IProviderWithChains,
  IWeb3Providers,
  SimpleFunction
} from '../helpers'
import { IChainType, WALLETS_EVENTS } from '../constants'
import { WalletConnect } from '../core'
import { providers } from 'src/providers'

const defaultConnectorOptions: IConnectorOptions = {
  connectorDefaultChains: 'all'
}

export class WalletsConnector {
  public configs: IProviderConfigs = {}

  public connector: WalletConnect
  public currentProviders: IWeb3Providers = {}

  private accounts: IProviderWithAccounts = {}

  private connectorOptions: IConnectorOptions

  constructor(
    providerOptions: IProviderOptions,
    cacheProviders = true,
    connectorOptions = defaultConnectorOptions
  ) {
    this.connectorOptions = connectorOptions
    const connector = new WalletConnect({
      cacheProviders,
      providerOptions
    })

    this.connector = connector
    this.connector.on(WALLETS_EVENTS.CONNECT, (data: IConnectEventPayload) => {
      const { provider, id: providerId } = data

      const connectedChains = this.connector.injectedChains(providerId)
      connectedChains.forEach((chain) => {
        const isEvmChain = [
          IChainType.ethereum,
          IChainType.binancesmartchain,
          IChainType.arbitrum,
          IChainType.aurora,
          IChainType.avalanche,
          IChainType.polygon,
          IChainType.fantom
        ].includes(chain)

        if (isEvmChain) {
          return
        }

        const chainMethods = this.getChainMethods(providerId, chain)
        const chainProvider = chainMethods?.methods?.getProvider?.()

        chainProvider?.on?.('accountsChanged', () =>
          this.loadProviderAccounts(providerId)
        )
      })

      provider?.on?.('accountsChanged', () => {
        this.loadProviderAccounts(providerId)
      })

      provider?.on?.('chainChanged', (chainId: string) => {
        this.setConfigs(providerId, chainId)
      })

      this.fireConfigs(providerId, provider)
    })

    this.connector.on(WALLETS_EVENTS.CLOSE, (providerId: string) => {
      this.setAccounts(providerId, null)

      this.connector.trigger(WALLETS_EVENTS.CURRENT_PROVIDER, {
        providerId,
        provider: null
      })

      if (this.cachedProviders.length === 0) {
        this.connector.trigger(WALLETS_EVENTS.DISCONNECTED)
      }
    })

    if (document?.readyState === 'complete') {
      this.init()
    }

    const documentStateChange = async (event: Event) => {
      if ((event?.target as Document)?.readyState === 'complete') {
        this.init()
        document?.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document?.addEventListener('readystatechange', documentStateChange)
  }

  private init() {
    if (this.cachedProviders?.length) {
      this.initFirstConnection()
    }
  }

  get cachedProviders() {
    return this.connector.cachedProviders
  }

  get chainSelectorOptions() {
    return this.connectorOptions.connectorDefaultChains
  }

  private getSavedEthereumProvider = (providerId: string) => {
    return this.currentProviders[providerId]
  }

  private removeSavedEthereumProvider = (providerId: string) => {
    const temp = { ...this.currentProviders }
    delete temp[providerId]
    this.currentProviders = temp
  }

  private initFirstConnection = async () => {
    const results = await this.connector.initFirstConnection()

    this.cachedProviders.map((providerId, providerIndex) => {
      const cachedProviderConnect = results[providerIndex]
      if (cachedProviderConnect.status === 'fulfilled') {
        const { id, connectedList } = cachedProviderConnect.value
        this.setAccounts(id, connectedList)
      } else {
        this.disconnect(providerId)
      }
    })
  }

  public connectTo = async (id: string, chains: IChainType[]) => {
    const { id: providerId, connectedList } = await this.connector.connectTo(
      id,
      chains
    )
    this.setAccounts(providerId, connectedList)
  }

  public dispose = () => {
    this.cachedProviders.forEach((p: string) => {
      this.disposeFor(p)
    })
  }

  public disposeFor = (providerId: string) => {
    const connectedChains = this.connector.injectedChains(providerId)

    connectedChains.forEach((chain) => {
      const chainMethods = this.getChainMethods(providerId, chain)
      const chainProvider = chainMethods?.methods?.getProvider?.()
      chainProvider?.removeAllListeners?.('accountsChanged')
    })

    const provider = this.getSavedEthereumProvider(providerId)

    provider?.removeAllListeners?.('accountsChanged')
    provider?.removeAllListeners?.('chainChanged')
    if (
      [
        providers.WALLETCONNECT.id,
        providers.WEB3AUTH.id,
        providers.TORUS.id
      ].includes(providerId)
    ) {
      provider?.disconnect?.()
    }
    this.removeSavedEthereumProvider(providerId)
  }

  private loadProviderAccounts = async (providerId: string) => {
    let accounts = [] as IChainToAccounts[]

    try {
      const { connectedList } = await this.connector.loadProviderAccounts(
        providerId
      )
      accounts = connectedList
    } catch (e) {
      console.error(e)
    }

    this.setAccounts(providerId, accounts)
  }

  private setConfigs = (providerId: string, chainId: string | number) => {
    const chainIdNumber =
      typeof chainId === 'string' ? parseInt(chainId, 16) : chainId

    this.configs = {
      ...this.configs,
      [providerId]: {
        network: CHAIN_DATA_LIST[chainIdNumber]?.network ?? 'unknown',
        chainId: chainIdNumber
      }
    }

    this.connector.trigger(WALLETS_EVENTS.CONNECTION_INFO, this.configs)
  }

  private setAccounts = (
    providerId: string,
    map: IChainToAccounts[] | null
  ) => {
    if (map) {
      const mapped = map.reduce((acc, item) => {
        return {
          ...acc,
          [item.chain]: item.accounts
        }
      }, {} as IChainWithAccount)
      this.accounts = { ...this.accounts, [providerId]: mapped }
    } else {
      const accountsTemp = { ...this.accounts }
      delete accountsTemp[providerId]
      this.accounts = accountsTemp
    }
    this.connector.trigger(WALLETS_EVENTS.ACCOUNTS, this.accounts)
  }

  public disconnect = (providerId?: string) => {
    if (providerId) {
      this.disposeFor(providerId)
    } else {
      this.dispose()
    }
    this.connector.clearCachedProvider(providerId)
  }

  public getChainMethods = (providerId: string, chain: IChainType) => {
    const chains = this.connector.findProviderFromOptions(providerId)?.chains
    return chains ? chains[chain] : undefined
  }

  public request = async ({
    providerId,
    chainId,
    method,
    params
  }: {
    providerId?: string
    chainId: IChainType
    method: string
    params: any
  }) => {
    if (!providerId) {
      throw new Error('providerId is required')
    }
    const targetProvider = this.getChainMethods(providerId, chainId)

    if (targetProvider && targetProvider.methods.request) {
      return targetProvider.methods.request(method, params)
    }

    const provider = this.getSavedEthereumProvider(providerId)

    if (!provider) {
      throw new Error(`Not supported ${method} for ${chainId}`)
    }

    return provider.request({
      method: method,
      params: params
    })
  }

  public on = (event: string, callback: SimpleFunction) => {
    return this.connector.on(event, callback)
  }

  public off(event: string, callback?: SimpleFunction): void {
    return this.connector.off(event, callback)
  }

  public getAccounts = (): IProviderWithAccounts | null => {
    return this.accounts
  }

  public isAvailableProvider = (providerId: string) => {
    return this.connector.isAvailableProvider(providerId)
  }

  public getInjectedChains = (): IProviderWithChains => {
    return this.cachedProviders.reduce((acc, item) => {
      acc[item] = this.connector.injectedChains(item)
      return acc
    }, {})
  }

  private fireConfigs = async (
    providerId: string,
    provider: any = undefined
  ) => {
    this.connector.trigger(WALLETS_EVENTS.CONNECTED_CHAINS, {
      providerId,
      chains: this.connector.injectedChains(providerId)
    })

    this.currentProviders[providerId] = provider

    this.connector.trigger(WALLETS_EVENTS.CURRENT_PROVIDER, {
      providerId,
      provider: provider
    })

    const chainId = provider.chainId
      ? provider.chainId
      : await provider?.getChainId?.()

    this.setConfigs(providerId, chainId)
  }
}
