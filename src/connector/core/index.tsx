import { ICoreOptions, IProviderUserOptions, SimpleFunction } from '../helpers'
import {
  CONNECT_EVENT,
  ERROR_EVENT,
  CLOSE_EVENT,
  SELECT_EVENT,
} from '../constants'
import { EventController, ProviderController } from '../controllers'

const INITIAL_STATE = {}

const defaultOpts: ICoreOptions = {
  cacheProvider: false,
  disableInjectedProvider: false,
  providerOptions: {},
  network: '',
}

export class Core {
  private eventController: EventController = new EventController()
  private providerController: ProviderController
  private userOptions: IProviderUserOptions[]

  constructor(opts?: Partial<ICoreOptions>) {
    const options: ICoreOptions = {
      ...defaultOpts,
      ...opts,
    }

    this.providerController = new ProviderController({
      disableInjectedProvider: options.disableInjectedProvider,
      cacheProvider: options.cacheProvider,
      providerOptions: options.providerOptions,
      network: options.network,
    })

    this.providerController.on(CONNECT_EVENT, (provider) =>
      this.onConnect(provider)
    )
    this.providerController.on(ERROR_EVENT, (error) => this.onError(error))

    this.providerController.on(SELECT_EVENT, this.onProviderSelect)

    this.userOptions = this.providerController.getUserOptions()
  }

  get cachedProvider(): string {
    return this.providerController.cachedProvider
  }

  // --------------- PUBLIC METHODS --------------- //

  public connect = (): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(CONNECT_EVENT, (provider) => resolve(provider))
      this.on(ERROR_EVENT, (error) => reject(error))
      this.on(CLOSE_EVENT, () => reject('Modal closed by user'))
      await this.toggle()
    })

  public connectTo = (id: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
      this.on(CONNECT_EVENT, (provider) => resolve(provider))
      this.on(ERROR_EVENT, (error) => reject(error))
      this.on(CLOSE_EVENT, () => reject('Modal closed by user'))
      const provider = this.providerController.getProvider(id)
      if (!provider) {
        return reject(
          new Error(
            `Cannot connect to provider (${id}), check provider options`
          )
        )
      }
      await this.providerController.connectTo(provider.id, provider.connector)
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

  public off(event: string, callback?: SimpleFunction): void {
    this.eventController.off({
      event,
      callback,
    })
  }

  public getUserOptions(): IProviderUserOptions[] {
    return this.userOptions
  }

  public clearCachedProvider(): void {
    this.providerController.clearCachedProvider()
  }

  public setCachedProvider(id: string): void {
    this.providerController.setCachedProvider(id)
  }

  // --------------- PRIVATE METHODS --------------- //

  private onError = async (error: any) => {
    this.eventController.trigger(ERROR_EVENT, error)
  }

  private onProviderSelect = (providerId: string) => {
    this.eventController.trigger(SELECT_EVENT, providerId)
  }

  private onConnect = async (provider: any) => {
    this.eventController.trigger(CONNECT_EVENT, provider)
  }

  private updateState = async (state: any) => {
    Object.keys(state).forEach((key) => {
      // @ts-ignore
      this[key] = state[key]
    })
    await window.updateWeb3Modal(state)
  }

  private resetState = () => this.updateState({ ...INITIAL_STATE })
}
