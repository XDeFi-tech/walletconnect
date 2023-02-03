import {
  canInject,
  convertToCommonChain,
  getChainData,
  IChainToAccounts,
  IChainWithAccount,
  IProviderConfigs,
  IProviderOptions,
  IProviderWithAccounts,
  IProviderWithChains,
  IWeb3Providers,
  SimpleFunction
} from '../helpers'
import { IChainType, WALLETS_EVENTS } from '../constants'
import { WalletConnect } from '../core'
import { Web3Provider, Network } from '@ethersproject/providers'

const INIT_RETRY_TIMEOUT = 500

export default function getLibrary(
  provider: any,
  callback: (n: Network) => void
): Web3Provider {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any'
  )
  library.pollingInterval = 15_000
  library.detectNetwork().then(callback)
  return library
}

export class WalletsConnector {
  public library: Web3Provider
  public configs: IProviderConfigs = {}

  public connector: WalletConnect
  public currentProviders: IWeb3Providers = {}

  private accounts: IProviderWithAccounts = {}

  constructor(
    providerOptions: IProviderOptions,
    network = 'mainnet',
    cacheProviders = true,
    isSingleProviderEnabled = true
  ) {
    const connector = new WalletConnect({
      network,
      cacheProviders,
      providerOptions,
      isSingleProviderEnabled
    })

    this.connector = connector
    this.connector.on(WALLETS_EVENTS.CONNECT, (data: any) => {
      const { provider, id: providerId } = data
      this.fireConfigs(providerId, provider)
      if (providerId) {
        const ethereum = this.getSavedEthereumProvider(providerId)
        if (ethereum) {
          ethereum.on('accountsChanged', () => {
            this.loadAccounts(providerId, undefined)
          })
          ethereum.on('disconnect', () => {
            this.disconnect(providerId)
          })
          ethereum.on('chainChanged', (chainId: string) =>
            this.setActiveChain(providerId, chainId)
          )
        }
      }
    })
    this.connector.on(WALLETS_EVENTS.CLOSE, (providerId: string) => {
      this.setAccounts(providerId, null)
      this.disposeFor(providerId)

      this.connector.trigger(WALLETS_EVENTS.CURRENT_PROVIDER, {
        providerId,
        provider: null
      })

      if (this.providers.length === 0) {
        this.connector.trigger(WALLETS_EVENTS.DISCONNECTED)
      }
    })

    this.connector.init()

    // GarageInc | 3.02.2022, handle for all subscription hooks in react app
    setTimeout(() => this.init())
  }

  private init() {
    const hasProviders = this.providers.every((providerId) => {
      // GarageInc | 15.07.2022: XDEFI injects async by timeout
      return !!this.connector.getEthereumProvider(providerId)
    })
    if (canInject() && hasProviders) {
      this.initFirstConnection()
    } else {
      setTimeout(() => this.init(), INIT_RETRY_TIMEOUT)
    }
  }

  get providers() {
    return this.connector.cachedProviders
  }

  private getSavedEthereumProvider = (providerId: string) => {
    return this.currentProviders[providerId]
  }

  private initFirstConnection = async () => {
    try {
      await this.connector
        .initFirstConnection()
        .then(({ provider }: any) => {
          return provider && provider.enable()
        })
        .catch((e) => {
          console.warn('Error', e)
        })
    } catch (e) {
      console.log('Error', e)
    }
  }

  public dispose = () => {
    this.providers.forEach((p: string) => {
      this.disposeFor(p)
    })
  }

  public disposeFor = (providerId: string) => {
    const ethereum = this.getSavedEthereumProvider(providerId)
    if (ethereum) {
      ethereum.removeListener('accountsChanged', () => {
        this.loadAccounts(providerId, undefined)
      })
      ethereum.removeListener('disconnect', () => {
        this.disconnect(providerId)
      })
      ethereum.removeListener('chainChanged', (chainId: string) =>
        this.setActiveChain(providerId, chainId)
      )
    }
  }

  private setActiveChain = (providerId: string, chainId: string) => {
    const c: IProviderConfigs = {
      ...this.configs,
      [providerId]: {
        ...this.configs[providerId],
        name: 'unknown',
        ...getChainData(parseInt(chainId, 16))
      }
    }
    this.loadAccounts(providerId, c)
  }

  private loadAccounts = async (
    providerId: string,
    c: IProviderConfigs | undefined
  ) => {
    if (!canInject()) {
      return
    }

    this.setAccounts(providerId, null)
    const ethereum = this.getSavedEthereumProvider(providerId)
    let ethAccounts: string[] = []

    try {
      ethAccounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })
    } catch (e) {
      ethAccounts = Array.isArray(ethereum.accounts) ? ethereum.accounts : []
    }

    const accounts = await this.connector.loadAccounts(providerId)

    const map = accounts
      ? accounts.reduce(
          (
            acc: Record<string, string[]>,
            item: PromiseFulfilledResult<IChainToAccounts>
          ) => {
            if (item.value) {
              const { chain, accounts } = item.value
              acc[chain] = accounts
            }
            return acc
          },
          {}
        )
      : {}

    this.setConfigs(providerId, c || this.configs, ethAccounts)

    const current = this.connector.findProviderFromOptions(providerId)

    const evmChainsAvailable: string[] = current?.supportedEvmChains

    if (evmChainsAvailable) {
      map[IChainType.ethereum] = ethAccounts
      evmChainsAvailable.forEach((chain) => {
        map[chain] = ethAccounts
      })
    } else {
      map[this.configs[providerId]?.network || IChainType.ethereum] =
        ethAccounts
    }

    this.setAccounts(providerId, map as IChainWithAccount)
  }

  private setConfigs = (
    providerId: string,
    targetConfigs: IProviderConfigs,
    ethAccounts: string[]
  ) => {
    this.configs = {
      ...targetConfigs,
      [providerId]: {
        ...targetConfigs[providerId],
        activeAddress: ethAccounts[0],
        network: convertToCommonChain(targetConfigs[providerId]?.network)
      }
    }
    this.connector.trigger(WALLETS_EVENTS.CONNECTION_INFO, this.configs)
  }

  private setAccounts = (providerId: string, map: IChainWithAccount | null) => {
    if (map) {
      this.accounts[providerId] = map
    } else {
      delete this.accounts[providerId]
    }
    this.connector.trigger(WALLETS_EVENTS.ACCOUNTS, this.accounts)
  }

  public disconnect = (providerId?: string) => {
    this.connector.clearCachedProvider(providerId)

    if (this.providers.length === 0)
      this.connector.trigger(WALLETS_EVENTS.DISCONNECTED)
  }

  public getChainMethods = (providerId: string, chain: IChainType) => {
    const chains = this.connector.findProviderFromOptions(providerId)?.chains
    return chains ? chains[chain] : undefined
  }

  public isRequestAvailable = ({
    providerId,
    chainId
  }: {
    providerId?: string
    chainId: IChainType
  }) => {
    const targetId = this.validateSingleProvider(providerId)
    const targetProvider = this.getChainMethods(targetId, chainId)

    return (
      targetProvider &&
      targetProvider.methods &&
      !!targetProvider.methods.request
    )
  }

  private validateSingleProvider = (providerId?: string): string => {
    if (!this.connector.isSingleProviderEnabled) {
      if (!providerId)
        throw new Error(
          'Multi providers were enabled, but target provider id was not provided'
        )
      return providerId
    } else {
      const target = this.providers[0]

      if (!target) {
        throw new Error('Not found provider for request')
      }

      return target
    }
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
    const targetId = this.validateSingleProvider(providerId)
    const targetProvider = this.getChainMethods(targetId, chainId)

    if (targetProvider && targetProvider.methods.request) {
      return targetProvider.methods.request(method, params)
    }

    const provider = this.getSavedEthereumProvider(targetId)

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

  public disabledByProvider = (providerId: string) => {
    return this.connector.disabledByProvider(providerId)
  }

  public getInjectedChains = (): IProviderWithChains => {
    return this.providers.reduce((acc, item) => {
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

    if (provider) {
      this.currentProviders[providerId] = provider

      this.connector.trigger(WALLETS_EVENTS.CURRENT_PROVIDER, {
        providerId,
        provider
      })

      this.library = getLibrary(provider, (n: Network) => {
        this.loadAccounts(providerId, {
          ...this.configs,
          [providerId]: {
            ...this.configs[providerId],
            ...n,
            ...getChainData(n.chainId)
          }
        })
      })
    }
  }
}
