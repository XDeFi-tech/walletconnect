import * as list from '../providers'
import {
  INJECTED_PROVIDER_ID,
  WALLETS_EVENTS,
  CACHED_MULTI_PROVIDERS_KEY,
  CACHED_PROVIDERS_CHAINS_KEY,
  IChainType
} from '../constants'
import {
  getLocal,
  setLocal,
  findAvailableEthereumProvider,
  isCurrentProviderActive,
  IProviderControllerOptions,
  IProviderOption,
  CHAIN_DATA_LIST,
  convertToCommonChain,
  IProviderDisplayWithConnector,
  IProviderOptions,
  IChainToAccounts
} from '../helpers'

import { EventController } from './events'

export class ProviderController {
  public cachedProviders: string[] = []
  public shouldCacheProviders = false

  private eventController: EventController = new EventController()
  public injectedChains: {
    [providerId: string]: IChainType[]
  } = {}

  private providers: IProviderDisplayWithConnector[] = []
  private providerOptions: IProviderOptions

  constructor(opts: IProviderControllerOptions) {
    this.shouldCacheProviders = opts.cacheProviders
    this.providerOptions = opts.providerOptions
  }

  public getInjectedById = (providerId: string) => {
    return list.injected[providerId.toUpperCase()]
  }

  public getProviderById = (providerId: string) => {
    return list.providers[providerId.toUpperCase()]
  }

  public init() {
    this.updateCachedProviders(getLocal(this.cachedProvidersKey) || [])
    this.injectedChains = getLocal(this.cachedProviderChainsKey) || {}
    this.providers = []

    Object.entries(this.providerOptions).map(([id, optionProvider]) => {
      const systemProvider = this.getProviderById(id)
      const connector = optionProvider.connector || list.connectors[id]
      this.providers.push({
        ...systemProvider,
        ...optionProvider.display,
        connector,
        id
      })
    })
  }

  public getUserOptions = () => {
    return this.providers.map(
      ({ id, name, logo, chains, installationLink }) => ({
        id,
        name,
        logo,
        chains,
        installationLink
      })
    )
  }

  public connectToChains = async (
    providerId: string,
    chains: string[] = []
  ) => {
    const options = this.findProviderFromOptions(providerId)

    const results: IChainToAccounts[] = []

    const providerHasChains = options?.chains
    const providerOption = this.getProviderOption(providerId)

    const ethereumProvider = options?.getEthereumProvider
      ? options?.getEthereumProvider()
      : await options?.connector(
          providerOption?.package,
          providerOption.options
        )

    if (providerHasChains) {
      const cachedChains = this.injectedChains[providerId]
      const connectList = cachedChains?.length ? cachedChains : chains

      for (const chain of connectList) {
        const providerChain = providerHasChains[chain]
        if (providerChain) {
          try {
            const accounts = await providerChain.methods.getAccounts()
            if (!accounts.length) {
              throw new Error(
                `Provider ${providerId} returned empty accounts for chain: ${chain}`
              )
            }

            results.push({
              chain: chain as IChainType,
              accounts: accounts
            })
          } catch (e) {
            console.error(e)

            if (
              e.message ===
              `Provider ${providerId} returned empty accounts for chain: ${chain}`
            ) {
              throw new Error(e.message)
            }
            if (e?.code === 4001) {
              throw new Error(e.code)
            }
          }
        }
      }
    } else {
      let ethAccounts: string[] = []

      let chain = IChainType.ethereum
      const chainId = await ethereumProvider.request({
        method: 'eth_chainId'
      })

      const chainUnformatted = CHAIN_DATA_LIST[Number(chainId)].network
      chain = convertToCommonChain(chainUnformatted)

      ethAccounts = ethereumProvider.enable
        ? await ethereumProvider.enable()
        : await ethereumProvider.request({
            method: 'eth_accounts'
          })

      results.push({
        chain: chain,
        accounts: ethAccounts
      })
    }

    return {
      connectedList: results,
      provider: ethereumProvider
    }
  }

  public getProvider(id: string) {
    return this.providers.find((x) => x.id === id)
  }

  public getProviderOption(id: string): IProviderOption {
    return this.providerOptions && this.providerOptions[id]
      ? this.providerOptions[id]
      : ({} as IProviderOption)
  }

  public clearCachedProvider(providerId?: string) {
    if (this.cachedProviders) {
      const listClear = providerId
        ? this.cachedProviders.filter((x) => x === providerId)
        : this.cachedProviders

      listClear.forEach((p) => {
        delete this.injectedChains[p]
      })

      const available = Object.keys(this.injectedChains)

      this.updateCachedProviders(available)

      setLocal(this.cachedProviderChainsKey, this.injectedChains)

      listClear.forEach((pid) => {
        this.trigger(WALLETS_EVENTS.CLOSE, pid)
      })
    }

    return false
  }

  private updateCachedProviders(providers: string[]) {
    this.cachedProviders = providers.filter(this.isAvailableProvider)
    setLocal(this.cachedProvidersKey, this.cachedProviders)

    this.trigger(WALLETS_EVENTS.UPDATED_PROVIDERS_LIST, this.cachedProviders)
  }

  public setCachedProvider(id: string, chains: IChainType[]) {
    const unique = new Set([...this.cachedProviders, id])
    this.updateCachedProviders(Array.from(unique))

    this.setInjectedChains(id, chains)
  }

  get cachedProvidersKey() {
    return CACHED_MULTI_PROVIDERS_KEY
  }

  get cachedProviderChainsKey() {
    return CACHED_PROVIDERS_CHAINS_KEY
  }

  public setInjectedChains(providerId: string, chains: IChainType[]) {
    this.injectedChains[providerId] = chains
    setLocal(this.cachedProviderChainsKey, this.injectedChains)
  }

  public findProviderFromOptions(providerId: string) {
    return this.providers.find(({ id }) => id === providerId)
  }

  public getEthereumProvider = (providerId: string) => {
    const options =
      this.findProviderFromOptions(providerId) ||
      list.providers[providerId.toUpperCase()]

    return options && options?.getEthereumProvider
      ? options?.getEthereumProvider()
      : findAvailableEthereumProvider()
  }

  public connectTo = async (id: string, chains: IChainType[]) => {
    try {
      this.trigger(WALLETS_EVENTS.SELECT, id)

      const { provider, connectedList } = await this.connectToChains(id, chains)

      if (this.shouldCacheProviders) {
        this.setCachedProvider(id, chains)
      }

      this.trigger(WALLETS_EVENTS.CONNECT, {
        provider,
        id
      })

      return { connectedList, id }
    } catch (error) {
      this.trigger(WALLETS_EVENTS.ERROR, error)
      throw error
    }
  }

  public async connectToCachedProviders() {
    return Promise.allSettled(
      (this.cachedProviders || []).map((pid: string) =>
        this.connectTo(pid, this.injectedChains[pid])
      )
    )
  }

  public isAvailableProvider = (providerId: string) => {
    const injected = this.getInjectedById(providerId)

    if (!injected) {
      return true // Provider is not defined at list of injected and we do not controll this provider
    }

    const provider = this.getEthereumProvider(providerId)

    if (providerId === INJECTED_PROVIDER_ID && provider) {
      return true
    }

    const isActive = isCurrentProviderActive(provider, injected)

    return isActive
  }

  public on(event: string, callback: (result: any) => void): () => void {
    this.eventController.on({
      event,
      callback
    })

    return () =>
      this.eventController.off({
        event,
        callback
      })
  }

  public off(event: string, callback?: (result: any) => void): void {
    this.eventController.off({
      event,
      callback
    })
  }

  public trigger(event: string, data: any = undefined): void {
    this.eventController.trigger(event, data)
  }
}
