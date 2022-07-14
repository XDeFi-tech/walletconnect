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
import { IChainType, WALLETS, WALLETS_EVENTS } from '../constants'
import { WalletConnect } from '../core'
import { Web3Provider, Network } from '@ethersproject/providers'

const INIT_RETRY_TIMEOUT = 300

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
  public isSingleProviderEnabled: boolean
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
      providerOptions
    })

    this.isSingleProviderEnabled = isSingleProviderEnabled
    this.connector = connector

    this.connector.on(WALLETS_EVENTS.CONNECT, (data: any) => {
      const { provider, id: providerId } = data
      this.fireConfigs(providerId, provider)

      if (providerId) {
        const ethereum = this.getEthereumProvider(providerId)

        if (ethereum) {
          ethereum.on('accountsChanged', () => {
            this.loadAccounts(providerId)
          })
          ethereum.on('disconnect', () => {
            this.disconnect()
          })
          ethereum.on('chainChanged', (chainId: string) =>
            this.setActiveChain(providerId, chainId)
          )
        }
      }
    })

    this.init()
  }

  private init() {
    if (canInject()) {
      this.connect()
    } else {
      this.retry()
    }
  }

  get providers() {
    return this.connector.cachedProviders
  }

  private retry() {
    this.connector.cachedProviders.forEach((providerId) => {
      if (providerId === WALLETS.xdefi)
        setTimeout(() => this.init(), INIT_RETRY_TIMEOUT)
    })
  }

  private getEthereumProvider = (providerId: string) =>
    this.connector.getEthereumProvider(providerId)

  private connect = async () => {
    try {
      this.connector.init()

      await this.connector
        .connect()
        .then((provider: any) => {
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
    this.providers.forEach((p) => {
      const ethereum = this.getEthereumProvider(p)
      if (ethereum) {
        ethereum.removeListener('accountsChanged')
        ethereum.removeListener('disconnect')
        ethereum.removeListener('chainChanged')
      }
    })
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
    c: IProviderConfigs | undefined = undefined
  ) => {
    if (!canInject()) {
      return
    }
    this.setAccounts(providerId, null)
    const ethereum = this.getEthereumProvider(providerId)

    const ethAccounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })
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

    const evmChainsAvailable =
      this.connector.injectedProvider(providerId)?.supportedEvmChains

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
    this.accounts[providerId] = map
    this.connector.trigger(WALLETS_EVENTS.ACCOUNTS, this.accounts)
  }

  public disconnect = (providerId?: string) => {
    this.connector.clearCachedProvider(providerId)

    if (providerId) {
      this.setAccounts(providerId, null)
    } else {
      this.providers.forEach((p) => {
        this.setAccounts(p, null)
      })
    }
  }

  public getChainMethods = (providerId: string, chain: IChainType) => {
    const chains = this.connector.injectedProvider(providerId)?.chains
    return chains ? chains[chain] : undefined
  }

  public isRequestAvailable = ({
    providerId,
    chainId
  }: {
    providerId?: string
    chainId: IChainType
  }) => {
    const targetId = this.validateSingleProvider()
    const targetProvider = this.getChainMethods(targetId, chainId)

    return (
      targetProvider &&
      targetProvider.methods &&
      !!targetProvider.methods.request
    )
  }

  private validateSingleProvider = (providerId?: string): string => {
    if (!this.isSingleProviderEnabled) {
      if (!providerId)
        throw new Error(
          'Multi providers were enabled, but target provider id was not provided'
        )
      return providerId
    } else {
      return this.providers[0]
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
    const targetId = this.validateSingleProvider()
    const targetProvider = this.getChainMethods(targetId, chainId)

    if (targetProvider && targetProvider.methods.request) {
      return targetProvider.methods.request(method, params)
    }

    switch (chainId) {
      case IChainType.ethereum: {
        return this.getEthereumProvider(targetId).request({
          method: method,
          params: params
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

  public getAccounts = (): IProviderWithAccounts | null => {
    return this.accounts
  }

  public getInjectedChains = (): IProviderWithChains => {
    return this.providers.reduce((acc, item) => {
      acc[item] = this.connector.injectedChains(item)
      return acc
    }, {})
  }

  public getCurrentProviders = (): IWeb3Providers => {
    return this.currentProviders
  }

  private fireConfigs = async (
    providerId: string,
    provider: any = undefined
  ) => {
    this.connector.trigger(WALLETS_EVENTS.CURRENT_WALLET, {
      providerId,
      injected: this.connector.injectedProvider(providerId)
    })

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
