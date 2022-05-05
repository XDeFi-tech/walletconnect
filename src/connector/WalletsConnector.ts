import Web3 from 'web3'

import {
  IChainToAccounts,
  IChainType,
  IChainWithAccount,
  IProviderOptions,
  SimpleFunction,
} from './helpers'
import { EventController } from './controllers'
import WalletConnect from './index'

export enum WALLETS_EVENTS {
  ACCOUNTS = 'ACCOUNTS',
  CURRENT_WALLET = 'CURRENT_WALLET',
  CONNECTED_CHAINS = 'CONNECTED_CHAINS',
}

export class WalletsConnector {
  private web3: Web3 | null = null

  public connector: WalletConnect
  private accounts: IChainWithAccount = {}
  private eventController: EventController = new EventController()

  constructor(providerOptions: IProviderOptions, network = 'mainnet') {
    debugger
    const connector = new WalletConnect({
      network,
      cacheProvider: false,
      providerOptions,
    })

    debugger
    connector
      .connect()
      .then((provider) => {
        this.web3 = new Web3(provider)
        return provider.enable()
      })
      .then((ethAccounts) => {
        debugger
        this.loadAccounts(ethAccounts)
        this.eventController.trigger(
          WALLETS_EVENTS.CURRENT_WALLET,
          this.connector.injectedProvider
        )
        this.eventController.trigger(
          WALLETS_EVENTS.CONNECTED_CHAINS,
          this.connector.injectedChains
        )
      })

    this.connector = connector
  }

  private loadAccounts = async (ethAccounts: string[]) => {
    if (!this.web3) {
      return
    }

    const accounts = await this.connector.loadAccounts()

    const map = accounts.reduce((acc: any, item: IChainToAccounts) => {
      acc[item.chain] = item.accounts
      return acc
    }, {})

    map[IChainType.ethereum] = ethAccounts

    this.accounts = map

    this.eventController.trigger(WALLETS_EVENTS.ACCOUNTS, this.accounts)
  }

  private getAccounts = (): IChainWithAccount => {
    return this.accounts
  }

  private getAddress = (chainId: IChainType): string => {
    const accounts = this.getAccounts()

    return accounts[chainId][0] as string
  }

  public getChainMethods = (chain: IChainType) => {
    const chains = this.connector.injectedProvider?.chains
    return chains ? chains[chain] : undefined
  }

  public signMessage = async (chainId: IChainType, hash: string) => {
    if (!this.web3) {
      return
    }

    const address = this.getAddress(chainId)

    switch (chainId) {
      case IChainType.ethereum: {
        return await this.web3.eth.sign(hash, address)
      }

      default: {
        const targetProvider = this.getChainMethods(chainId)
        if (targetProvider && targetProvider.methods.signTransaction) {
          return await targetProvider.methods.signTransaction(hash)
        }
      }
    }
  }

  public request = async (chainId: IChainType, type: string, data: any) => {
    const targetProvider = this.getChainMethods(chainId)

    if (targetProvider && targetProvider.methods.request) {
      return await targetProvider.methods.request(type, data)
    }

    throw new Error(`Not supported ${type} for ${chainId}`)
  }

  public on = (event: string, callback: SimpleFunction) => {
    this.eventController.on({
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
}
