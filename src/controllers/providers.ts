/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as list from '../providers'
import {
  CONNECT_EVENT,
  ERROR_EVENT,
  SELECT_EVENT,
  INJECTED_PROVIDER_ID,
  CACHED_PROVIDER_KEY,
  CACHED_PROVIDER_CHAINS_KEY,
  CLOSE_EVENT,
} from '../constants'
import {
  isMobile,
  IProviderControllerOptions,
  IProviderOptions,
  IProviderDisplayWithConnector,
  getLocal,
  setLocal,
  removeLocal,
  getProviderInfoById,
  getProviderDescription,
  IProviderInfo,
  filterMatches,
  IProviderUserOptions,
  getInjectedProvider,
  findMatchingRequiredOptions,
  IProviderOption,
  IChainToAccounts,
  IChainType,
} from '../helpers'

import { EventController } from './events'

export class ProviderController {
  public cachedProvider = ''
  public shouldCacheProvider = false
  public disableInjectedProvider = false

  private eventController: EventController = new EventController()
  public injectedChains: string[] = []
  public injectedProvider: IProviderInfo | null = null
  private providers: IProviderDisplayWithConnector[] = []
  private providerOptions: IProviderOptions
  private network = ''

  constructor(opts: IProviderControllerOptions) {
    this.cachedProvider = getLocal(CACHED_PROVIDER_KEY) || ''
    this.injectedChains = getLocal(CACHED_PROVIDER_CHAINS_KEY) || []

    this.disableInjectedProvider = opts.disableInjectedProvider
    this.shouldCacheProvider = opts.cacheProvider
    this.providerOptions = opts.providerOptions
    this.network = opts.network

    this.injectedProvider = getInjectedProvider()

    this.providers = Object.keys(list.connectors).map((id: string) => {
      let providerInfo: IProviderInfo
      if (id === INJECTED_PROVIDER_ID) {
        providerInfo = this.injectedProvider || list.providers.FALLBACK
      } else {
        providerInfo = getProviderInfoById(id)
      }
      // parse custom display options
      if (this.providerOptions[id]) {
        const options = this.providerOptions[id]
        if (typeof options.display !== 'undefined') {
          providerInfo = {
            ...providerInfo,
            ...this.providerOptions[id].display,
          }
        }
      }
      return {
        ...providerInfo,
        // @ts-ignore
        connector: list.connectors[id],
        package: providerInfo.package,
      }
    })

    // parse custom providers
    Object.keys(this.providerOptions)
      .filter((key) => key.startsWith('custom-'))
      .map((id) => {
        if (id && this.providerOptions[id]) {
          const options = this.providerOptions[id]
          if (
            typeof options.display !== 'undefined' &&
            typeof options.connector !== 'undefined'
          ) {
            this.providers.push({
              ...list.providers.FALLBACK,
              id,
              ...options.display,
              connector: options.connector,
            })
          }
        }
      })
  }

  public shouldDisplayProvider(id: string) {
    const provider = this.getProvider(id)
    if (typeof provider !== 'undefined') {
      const providerPackageOptions = this.providerOptions[id]
      if (providerPackageOptions) {
        const isProvided = !!providerPackageOptions.package
        if (isProvided) {
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
    }
    return false
  }

  public getUserOptions = () => {
    const mobile = isMobile()

    const defaultProviderList = this.providers.map(({ id }) => id)

    const displayInjected =
      !!this.injectedProvider && !this.disableInjectedProvider
    const onlyInjected = displayInjected && mobile

    const providerList = []

    if (onlyInjected) {
      providerList.push(INJECTED_PROVIDER_ID)
    } else {
      if (displayInjected) {
        providerList.push(INJECTED_PROVIDER_ID)
      }

      defaultProviderList.forEach((id: string) => {
        if (id !== INJECTED_PROVIDER_ID) {
          const result = this.shouldDisplayProvider(id)
          if (result) {
            providerList.push(id)
          }
        }
      })
    }

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
          ...rest,
        })
      }
    })

    return userOptions
  }

  public connectToChains = async (): Promise<IChainToAccounts[]> => {
    const currentProviderChains = this.injectedProvider
      ? this.injectedProvider?.chains
      : undefined

    if (
      this.injectedChains &&
      this.injectedChains.length > 0 &&
      currentProviderChains
    ) {
      return Promise.all(
        this.injectedChains
          .filter((chain) => !!currentProviderChains[chain])
          .map((chain) => {
            const target = currentProviderChains[chain]

            return target.methods.getAccounts().then((accounts: string[]) => {
              return {
                chain: chain,
                accounts: accounts,
              }
            })
          })
      )
    } else {
      if (this.injectedProvider) {
        console.log('setInjectedChains', currentProviderChains)
        this.setInjectedChains([IChainType.ethereum])
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

  public clearCachedProvider() {
    this.cachedProvider = ''
    this.injectedProvider = null
    removeLocal(CACHED_PROVIDER_KEY)
    removeLocal(CACHED_PROVIDER_CHAINS_KEY)

    this.eventController.trigger(CLOSE_EVENT)
  }

  public setCachedProvider(id: string, chains: string[]) {
    this.cachedProvider = id
    setLocal(CACHED_PROVIDER_KEY, id)
    this.setInjectedChains(chains)
  }

  public setInjectedChains(chains: string[]) {
    this.injectedChains = chains
    setLocal(CACHED_PROVIDER_CHAINS_KEY, chains)
  }

  public connectTo = async (
    id: string,
    connector: (
      providerPackage: any,
      opts: any,
      chains?: string[]
    ) => Promise<any>,
    chains?: string[]
  ) => {
    try {
      this.eventController.trigger(SELECT_EVENT, id)
      const providerPackage = this.getProviderOption(id)?.package
      const providerOptions = this.getProviderOption(id)?.options
      const opts = { network: this.network || undefined, ...providerOptions }
      const provider = await connector(providerPackage, opts, chains)

      const cachedChains = chains ? chains : [IChainType.ethereum]

      this.eventController.trigger(CONNECT_EVENT, provider)

      if (this.shouldCacheProvider && this.cachedProvider !== id) {
        this.setCachedProvider(id, cachedChains)
      }
      this.setInjectedChains(cachedChains)

      this.connectToChains()
    } catch (error) {
      this.eventController.trigger(ERROR_EVENT, error)
    }
  }

  public async connectToCachedProvider() {
    const provider = this.getProvider(this.cachedProvider)
    if (provider) {
      await this.connectTo(provider.id, provider.connector, this.injectedChains)
    }
  }

  public on(event: string, callback: (result: any) => void): () => void {
    this.eventController.on({
      event,
      callback,
    })

    return () =>
      this.eventController.off({
        event,
        callback,
      })
  }

  public off(event: string, callback?: (result: any) => void): void {
    this.eventController.off({
      event,
      callback,
    })
  }
}