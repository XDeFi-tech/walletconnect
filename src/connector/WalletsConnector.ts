import { ethers } from 'ethers'
import Web3 from 'web3'

import {
  IChainToAccounts,
  IChainType,
  IChainWithAccount,
  IProviderOptions,
} from './helpers'
import WalletConnect from './index'

function initWeb3(provider: any) {
  const web3: any = new Web3(provider)

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  })

  return web3
}

export class WalletsConnector {
  public web3: Web3 | null = null

  public connector: WalletConnect
  public accounts: IChainWithAccount = {}

  constructor(providerOptions: IProviderOptions) {
    const connector = new WalletConnect({
      network: 'mainnet', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    })

    connector
      .connect()
      .then((provider) => {
        this.web3 = initWeb3(new ethers.providers.Web3Provider(provider))
        return provider.enable()
      })
      .then(() => {
        this.loadAccounts()
      })

    this.connector = connector
  }

  loadAccounts = async () => {
    if (!this.web3) {
      return
    }

    const accounts = await this.connector.loadAccounts()

    const map = accounts.reduce((acc: any, item: IChainToAccounts) => {
      acc[item.chain] = item.accounts
      return acc
    }, {})

    console.log(this.web3)
    map[IChainType.ethereum] = await this.web3.eth.getAccounts()

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
          console.log(chainId, targetProvider)
          return await targetProvider.methods.signTransaction(hash)
        }
      }
    }
  }

  signPersonalMessage = async (chainId: IChainType, hexMsg: string) => {
    if (!this.web3) {
      return
    }

    const address = this.getAddress(chainId)

    switch (chainId) {
      case IChainType.ethereum: {
        // @ts-ignore
        return await this.web3.eth.personal.sign(hexMsg, address)
      }
      default: {
        throw new Error('Not supported chain for personal sign')
      }
    }
  }
}
