import { ICoreOptions, IProviderUserOptions, SimpleFunction } from '../helpers'
import { WALLETS_EVENTS } from '../constants'
import { EventController, ProviderController } from '../controllers'

const defaultOpts: ICoreOptions = {
  cacheProviders: false,
  disableInjectedProvider: false,
  providerOptions: {},
  network: ''
}

export class WalletConnect {
  private eventController: EventController = new EventController()
  private providerController: ProviderController
  private userOptions: IProviderUserOptions[]

  constructor(opts?: Partial<ICoreOptions>) {
    const options: ICoreOptions = {
      ...defaultOpts,
      ...opts
    }

    this.providerController = new ProviderController({
      disableInjectedProvider: options.disableInjectedProvider,
      cacheProviders: options.cacheProviders,
      providerOptions: options.providerOptions,
      network: options.network
    })

    this.providerController.on(WALLETS_EVENTS.CLOSE, (providerId?: string) =>
      this.trigger(WALLETS_EVENTS.CLOSE, providerId)
    )

    this.providerController.on(
      WALLETS_EVENTS.UPDATED_PROVIDERS_LIST,
      (providers: string[]) => {
        this.trigger(WALLETS_EVENTS.UPDATED_PROVIDERS_LIST, providers)
      }
    )

    this.providerController.on(
      WALLETS_EVENTS.UPDATED_PROVIDERS_LIST,
      (providers: string[]) =>
        this.trigger(WALLETS_EVENTS.UPDATED_PROVIDERS_LIST, providers)
    )

    this.providerController.on(WALLETS_EVENTS.CONNECT, (provider) =>
      this.onConnect(provider)
    )

    this.providerController.on(WALLETS_EVENTS.ERROR, (error) =>
      this.onError(error)
    )

    this.providerController.on(WALLETS_EVENTS.SELECT, this.onProviderSelect)

    this.init()
  }

  public init() {
    this.providerController.init()
    this.userOptions = this.providerController.getUserOptions()
  }

  public findProviderFromOptions(providerId: string) {
    return this.providerController.findProviderFromOptions(providerId)
  }

  public getInjectedById = (providerId: string) => {
    return this.providerController.getInjectedById(providerId)
  }

  public isAvailableProvider = (providerId: string) => {
    return this.providerController.isAvailableProvider(providerId)
  }

  public disabledByProvider = (providerId: string) => {
    return this.providerController.disabledByProvider(providerId)
  }

  get cachedProviders(): string[] {
    return this.providerController.cachedProviders
  }

  injectedChains(providerId: string): string[] {
    return this.providerController.injectedChains[providerId]
  }

  public getEthereumProvider = (providerId: string) =>
    this.providerController.getEthereumProvider(providerId)

  public loadProviderAccounts = async (providerId: string) => {
    return await this.providerController.connectToChains(providerId)
  }

  // --------------- PUBLIC METHODS --------------- //

  public initFirstConnection = (): Promise<any> =>
    new Promise((resolve, reject) => {
      this.subscribeToWalletEvents(resolve, reject)
      this.providerController.connectToCachedProviders()
    })

  public connectTo = (id: string, chains: string[]): Promise<any> =>
    new Promise((resolve, reject) => {
      this.subscribeToWalletEvents(resolve, reject)
      const provider = this.providerController.getProvider(id)
      if (!provider) {
        return reject(
          new Error(
            `Cannot connect to provider (${id}), check provider options`
          )
        )
      }
      this.providerController.connectTo(provider.id, provider.connector, chains)
    })

  public connectToChains = (id: string, chains: string[]): Promise<any> =>
    new Promise((resolve, reject) => {
      this.subscribeToConnection(id, resolve, reject)
      this.providerController.connectToChains(id, chains)
    })

  private subscribeToConnection = (
    id: string,
    resolve: (value: any) => void,
    reject: (reason: any) => void
  ) => {
    this.subscribeToWalletEvents(resolve, reject)
  }

  private subscribeToWalletEvents = (
    resolve: (value: any) => void,
    reject: (reason: any) => void
  ) => {
    this.on(WALLETS_EVENTS.CONNECT, (provider) => resolve(provider))
    this.on(WALLETS_EVENTS.ERROR, (error) => reject(error))
    this.on(WALLETS_EVENTS.CLOSE, (providerId?: string) =>
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(`Closed by user ${providerId}`)
    )
  }

  public on(event: string, callback: SimpleFunction): SimpleFunction {
    this.eventController.on({
      event,
      callback
    })

    return () => {
      this.eventController.off({
        event,
        callback
      })
    }
  }

  public off(event: string, callback?: SimpleFunction): void {
    return this.eventController.off({
      event,
      callback
    })
  }

  public trigger(event: string, data: any = undefined): void {
    this.eventController.trigger(event, data)
  }

  public getUserOptions(): IProviderUserOptions[] {
    return this.userOptions
  }

  public clearCachedProvider(providerId?: string): void {
    this.providerController.clearCachedProvider(providerId)
  }

  // --------------- PRIVATE METHODS --------------- //

  private onError = async (error: any) => {
    this.trigger(WALLETS_EVENTS.ERROR, error)
  }

  private onProviderSelect = (providerId: string) => {
    this.trigger(WALLETS_EVENTS.SELECT, providerId)
  }

  private onConnect = async (provider: any) => {
    this.trigger(WALLETS_EVENTS.CONNECT, provider)
  }
}
