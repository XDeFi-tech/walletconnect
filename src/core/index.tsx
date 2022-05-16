import {
  ICoreOptions,
  IProviderInfo,
  IProviderUserOptions,
  SimpleFunction
} from '../helpers'
import { WALLETS_EVENTS } from '../constants'
import { EventController, ProviderController } from '../controllers'

const defaultOpts: ICoreOptions = {
  cacheProvider: false,
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
      cacheProvider: options.cacheProvider,
      providerOptions: options.providerOptions,
      network: options.network
    })

    this.providerController.on(WALLETS_EVENTS.CONNECT, (provider) =>
      this.onConnect(provider)
    )
    this.providerController.on(WALLETS_EVENTS.ERROR, (error) =>
      this.onError(error)
    )

    this.providerController.on(WALLETS_EVENTS.SELECT, this.onProviderSelect)

    this.userOptions = this.providerController.getUserOptions()
  }

  get injectedProvider(): IProviderInfo | null {
    return this.providerController.injectedProvider
  }

  get cachedProvider(): string {
    return this.providerController.cachedProvider
  }

  get injectedChains(): string[] {
    return this.providerController.injectedChains
  }

  public loadAccounts(): Promise<any> {
    return this.providerController.connectToChains()
  }

  // --------------- PUBLIC METHODS --------------- //

  public connect = (): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(WALLETS_EVENTS.CONNECT, (provider) => resolve(provider))
      this.on(WALLETS_EVENTS.ERROR, (error) => reject(error))
      this.on(WALLETS_EVENTS.CLOSE, () => reject('Closed by user'))

      await this.toggle()
    })

  public connectTo = (id: string, chains: string[]): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(WALLETS_EVENTS.CONNECT, (provider) => resolve(provider))
      this.on(WALLETS_EVENTS.ERROR, (error) => reject(error))
      this.on(WALLETS_EVENTS.CLOSE, () => reject('Closed by user'))

      const provider = this.providerController.getProvider(id)
      if (!provider) {
        return reject(
          new Error(
            `Cannot connect to provider (${id}), check provider options`
          )
        )
      }
      await this.providerController.connectTo(
        provider.id,
        provider.connector,
        chains
      )
    })

  public async toggle(): Promise<void> {
    if (this.cachedProvider) {
      await this.providerController.connectToCachedProvider()
      return
    }
    if (
      this.userOptions &&
      this.userOptions.length === 1 &&
      this.userOptions[0].name
    ) {
      await this.userOptions[0].onClick()
      return
    }
  }

  public on(event: string, callback: SimpleFunction): SimpleFunction {
    console.log('on', event)
    this.eventController.on({
      event,
      callback
    })

    return () => {
      console.log('off', event)
      this.eventController.off({
        event,
        callback
      })
    }
  }

  public off(event: string, callback?: SimpleFunction): void {
    this.eventController.off({
      event,
      callback
    })
  }

  public trigger(event: string, data: any = undefined): void {
    console.log('triggered', event)
    this.eventController.trigger(event, data)
  }

  public getUserOptions(): IProviderUserOptions[] {
    return this.userOptions
  }

  public clearCachedProvider(): void {
    this.providerController.clearCachedProvider()
    this.trigger(WALLETS_EVENTS.CLOSE)
  }

  // --------------- PRIVATE METHODS --------------- //

  private onError = async (error: any) => {
    this.eventController.trigger(WALLETS_EVENTS.ERROR, error)
  }

  private onProviderSelect = (providerId: string) => {
    this.eventController.trigger(WALLETS_EVENTS.SELECT, providerId)
  }

  private onConnect = async (provider: any) => {
    this.eventController.trigger(WALLETS_EVENTS.CONNECT, provider)
  }
}
