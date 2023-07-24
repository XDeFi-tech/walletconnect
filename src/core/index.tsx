import {
  IConnectEventPayload,
  ICoreOptions,
  IProviderUserOptions,
  SimpleFunction
} from '../helpers'
import { IChainType, WALLETS_EVENTS } from '../constants'
import { EventController, ProviderController } from '../controllers'

const defaultOpts: ICoreOptions = {
  cacheProviders: false,
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
      WALLETS_EVENTS.CONNECT,
      (provider: IConnectEventPayload) => this.onConnect(provider)
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

  public isAvailableProvider = (providerId: string) => {
    return this.providerController.isAvailableProvider(providerId)
  }

  get cachedProviders(): string[] {
    return this.providerController.cachedProviders
  }

  injectedChains(providerId: string): IChainType[] {
    return this.providerController.injectedChains[providerId]
  }

  public loadProviderAccounts = async (providerId: string) => {
    return await this.providerController.connectToChains(providerId)
  }

  // --------------- PUBLIC METHODS --------------- //

  public initFirstConnection = () =>
    this.providerController.connectToCachedProviders()

  public connectTo = (id: string, chains: IChainType[]) =>
    this.providerController.connectTo(id, chains)

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

  private onConnect = async (provider: IConnectEventPayload) => {
    this.trigger(WALLETS_EVENTS.CONNECT, provider)
  }
}
