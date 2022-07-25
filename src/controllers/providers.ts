/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as list from '../providers'
import {
  INJECTED_PROVIDER_ID,
  CACHED_PROVIDER_KEY,
  CACHED_PROVIDER_CHAINS_KEY,
  WALLETS_EVENTS,
  CACHED_MULTI_PROVIDERS_KEY,
  CACHED_PROVIDERS_CHAINS_KEY
} from '../constants'
import {
  IProviderControllerOptions,
  IProviderOptions,
  IProviderDisplayWithConnector,
  getLocal,
  setLocal,
  getProviderInfoById,
  getProviderDescription,
  IProviderInfo,
  filterMatches,
  IProviderUserOptions,
  findMatchingRequiredOptions,
  IProviderOption,
  canInject,
  findAvailableEthereumProvider,
  isCurrentProviderActive
} from '../helpers'
import { IChainType } from '../constants'

import { EventController } from './events'

export class ProviderController {
  public cachedProviders: string[] = []
  public shouldCacheProviders = false
  public disableInjectedProvider = false
  public isSingleProviderEnabled: Boolean | undefined

  private eventController: EventController = new EventController()
  public injectedChains: {
    [providerId: string]: string[]
  } = {}
  private providers: IProviderDisplayWithConnector[] = []
  private providerOptions: IProviderOptions
  private network = ''

  constructor(opts: IProviderControllerOptions) {
    this.disableInjectedProvider = opts.disableInjectedProvider
    this.shouldCacheProviders = opts.cacheProviders
    this.providerOptions = opts.providerOptions
    this.network = opts.network
    this.isSingleProviderEnabled = opts.isSingleProviderEnabled
  }

  public getInjectedById = (providerId: string) => {
    return list.injected[providerId.toUpperCase()]
  }

  public init() {
    this.updateCachedProviders(getLocal(this.cachedProvidersKey) || [])
    this.injectedChains = getLocal(this.cachedProviderChainsKey) || {}

    this.providers = []

    // parse custom providers
    Object.keys(this.providerOptions).map((id) => {
      if (id && this.providerOptions[id]) {
        const options = this.providerOptions[id]
        const displayProps = this.getInjectedById(id)
        if (typeof displayProps !== 'undefined') {
          this.providers.push({
            ...list.providers.FALLBACK,
            connector: options.connector || list.connectors.injected,
            ...displayProps,
            ...options.display,
            id
          })
        }
      }
    })
    this.providers.push(
      ...Object.keys(list.connectors)
        .filter((id: string) => !!this.providerOptions[id])
        .map((id: string) => {
          let providerInfo: IProviderInfo
          if (id === INJECTED_PROVIDER_ID) {
            providerInfo =
              this.getProviderOption(id)?.display || list.providers.FALLBACK
          } else {
            providerInfo = getProviderInfoById(id)
          }
          // parse custom display options
          if (this.providerOptions[id]) {
            providerInfo = {
              ...providerInfo,
              ...this.providerOptions[id].display
            }
          }
          return {
            ...providerInfo,
            // @ts-ignore
            connector: list.connectors[id],
            package: providerInfo.package
          }
        })
    )
  }

  public shouldDisplayProvider(id: string) {
    const provider = this.getProvider(id)
    if (typeof provider !== 'undefined') {
      const providerPackageOptions = this.providerOptions[id]
      if (providerPackageOptions) {
        const requiredOptions = provider.package
          ? provider.package.required
          : undefined

        if (requiredOptions && requiredOptions.length) {
          const providedOptions = providerPackageOptions.options
          if (providedOptions && Object.keys(providedOptions).length) {
            const matches = findMatchingRequiredOptions(
              requiredOptions,
              providedOptions
            )
            if (requiredOptions.length === matches.length) {
              return true
            }
          }
        } else {
          return true
        }
      }
    }
    return false
  }

  public getUserOptions = () => {
    const defaultProviderList = Array.from(
      new Set(this.providers.map(({ id }) => id))
    )

    const availableInjectedList = defaultProviderList.filter(
      (pid) => this.getInjectedById(pid) && this.isAvailableProvider(pid)
    )

    const displayInjected =
      (!this.disableInjectedProvider && availableInjectedList.length === 0) ||
      canInject() === undefined

    const providerList: string[] = []

    defaultProviderList.forEach((id: string) => {
      if (id !== INJECTED_PROVIDER_ID) {
        const result = this.shouldDisplayProvider(id)
        if (result) {
          providerList.push(id)
        }
      } else if (displayInjected) {
        providerList.push(INJECTED_PROVIDER_ID)
      }
    })

    const userOptions: IProviderUserOptions[] = []

    providerList.forEach((id: string) => {
      const provider = this.getProvider(id)
      if (typeof provider !== 'undefined') {
        const { id, name, logo, connector, ...rest } = provider

        userOptions.push({
          id,
          name,
          logo,
          description: getProviderDescription(provider),
          onClick: (chains?: string[]) => this.connectTo(id, connector, chains),
          ...rest
        })
      }
    })

    return userOptions
  }

  public connectToChains = async (providerId: string) => {
    const currentProviderChains = this.findProviderFromOptions
      ? this.findProviderFromOptions(providerId)?.chains
      : undefined
    if (
      this.injectedChains &&
      this.injectedChains[providerId] &&
      this.injectedChains[providerId].length > 0 &&
      currentProviderChains
    ) {
      return Promise.allSettled(
        this.injectedChains[providerId]
          .filter(
            (chain) =>
              !!currentProviderChains[chain] && chain !== IChainType.ethereum
          )
          .map((chain) => {
            const target = currentProviderChains[chain]

            return target.methods.getAccounts().then((accounts: string[]) => {
              return {
                chain: chain,
                accounts: accounts
              }
            })
          })
      )
    } else {
      if (this.findProviderFromOptions(providerId)) {
        this.setInjectedChains(providerId, [IChainType.ethereum])
      }
    }

    return []
  }

  public getProvider(id: string) {
    return filterMatches<IProviderDisplayWithConnector>(
      this.providers,
      (x) => x.id === id,
      undefined
    )
  }

  public getProviderOption(id: string): IProviderOption {
    return this.providerOptions && this.providerOptions[id]
      ? this.providerOptions[id]
      : ({} as IProviderOption)
  }

  public clearCachedProvider(providerId?: string): boolean {
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

      this.trigger(WALLETS_EVENTS.CLOSE, providerId)
      return true
    }

    return false
  }

  private updateCachedProviders(providers: string[]) {
    this.cachedProviders = (
      this.isSingleProviderEnabled && providers.length > 0
        ? providers.slice(0, 1)
        : providers
    ).filter(this.isAvailableProvider)
    setLocal(this.cachedProvidersKey, this.cachedProviders)

    this.trigger(WALLETS_EVENTS.UPDATED_PROVIDERS_LIST, this.cachedProviders)
  }

  public setCachedProvider(id: string, chains: string[]) {
    const unique = new Set([...this.cachedProviders, id])
    this.updateCachedProviders(Array.from(unique))

    this.setInjectedChains(id, chains)
  }

  get cachedProvidersKey() {
    return this.isSingleProviderEnabled
      ? CACHED_PROVIDER_KEY
      : CACHED_MULTI_PROVIDERS_KEY
  }

  get cachedProviderChainsKey() {
    return this.isSingleProviderEnabled
      ? CACHED_PROVIDER_CHAINS_KEY
      : CACHED_PROVIDERS_CHAINS_KEY
  }

  public setInjectedChains(providerId: string, chains: string[]) {
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

  public connectTo = async (
    id: string,
    connector: (
      providerPackage: any,
      opts: any,
      chains?: string[],
      getProvider?: () => any
    ) => Promise<any>,
    chains?: string[]
  ) => {
    try {
      this.trigger(WALLETS_EVENTS.SELECT, id)
      const options = this.getProviderOption(id)
      const providerPackage = options?.package
      const providerOptions = options?.options
      const display = options?.display
      const opts = { network: this.network || undefined, ...providerOptions }

      const provider = await connector(
        providerPackage,
        opts,
        chains,
        display?.getEthereumProvider
      )

      const cachedChains = chains ? chains : [IChainType.ethereum]

      this.trigger(WALLETS_EVENTS.CONNECT, {
        provider,
        id
      })

      if (this.shouldCacheProviders) {
        this.setCachedProvider(id, cachedChains)
      }

      this.connectToChains(id)
    } catch (error) {
      this.trigger(WALLETS_EVENTS.ERROR, error)
    }
  }

  public async connectToCachedProviders() {
    return Promise.allSettled(
      this.cachedProviders
        .filter(this.isAvailableProvider)
        .map((pid: string) => {
          const provider = this.getProvider(pid)
          if (provider) {
            return this.connectTo(
              provider.id,
              provider.connector,
              this.injectedChains[provider.id]
            )
          }
          return null
        })
    )
  }

  public isAvailableProvider = (providerId: string) => {
    const injected = this.getInjectedById(providerId)

    if (!injected) {
      return true // Provider is not defined at list of injected and we do not controll this provider
    }

    const provider = this.getEthereumProvider(providerId)
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
