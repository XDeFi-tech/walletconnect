import Web3 from 'web3'

import {
  IChainToAccounts,
  IChainType,
  IChainWithAccount,
  IProviderOptions,
} from './helpers'
import WalletConnect from './index'

export class WalletsConnector {
  public web3: Web3 | null = null

  public connector: WalletConnect
  public accounts: IChainWithAccount = {}

  constructor(providerOptions: IProviderOptions, network = 'mainnet') {
    const connector = new WalletConnect({
      network,
      cacheProvider: true,
      providerOptions,
    })

    connector
      .connect()
      .then((provider) => {
        this.web3 = new Web3(provider)
        return provider.enable()
      })
      .then((ethAccounts) => {
        this.loadAccounts(ethAccounts)
      })

    this.connector = connector
  }

  loadAccounts = async (ethAccounts: string[]) => {
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
  }

  getAccounts = (): IChainWithAccount => {
    return this.accounts
  }

  getAddress = (chainId: IChainType): string => {
    const accounts = this.getAccounts()

    return accounts[chainId][0] as string
  }

  getAvailableChains = (): string[] => {
    return this.connector.injectedChains
  }

  getChainMethods = (chain: IChainType) => {
    const chains = this.connector.injectedProvider?.chains
    return chains ? chains[chain] : undefined
  }

  signMessage = async (chainId: IChainType, hash: string) => {
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

  request = async (chainId: IChainType, type: string, data: any) => {
    const targetProvider = this.getChainMethods(chainId)

    if (targetProvider && targetProvider.methods.request) {
      return await targetProvider.methods.request(type, data)
    }

    throw new Error(`Not supported ${type} for ${chainId}`)
  }
}
