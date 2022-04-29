import { ethers } from 'ethers'
import { convertUtf8ToHex } from '@walletconnect/utils'
import Web3 from 'web3'
import { recoverPublicKey } from 'ethers/lib/utils'

import { IProviderOptions, SupportedChainId } from './helpers'
import WalletConnect from './index'
import {
  ETH_SEND_TRANSACTION,
  ETH_SIGN,
  PERSONAL_SIGN,
} from './example/constants'
import {
  formatTestTransaction,
  hashPersonalMessage,
  recoverPersonalSignature,
} from './example/helpers/utilities'

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

interface IAccount {
  address: string
}

interface IChainWithAccount {
  [chainId: number]: IAccount
}

export class WalletsConnector {
  public provider: ethers.providers.Web3Provider | null = null
  public web3Signer: ethers.providers.JsonRpcSigner | null = null
  public web3: Web3 | null = null

  public connector: WalletConnect

  constructor(providerOptions: IProviderOptions) {
    const connector = new WalletConnect({
      network: 'mainnet', // optional
      cacheProvider: true, // optional
      providerOptions, // required
    })

    connector.connect().then((instance) => {
      this.provider = new ethers.providers.Web3Provider(instance)
      this.web3Signer = this.provider.getSigner()

      this.web3 = initWeb3(this.provider)
    })

    this.connector = connector
  }

  connect = async () => {
    return {}
  }

  getAccounts = (): IChainWithAccount => {
    if (this.web3) {
    }

    return {}
  }

  getAddress = (chainId: SupportedChainId) => {
    const accounts = this.getAccounts()

    const { address } = accounts[chainId]

    return address
  }

  getAvailableChains = () => {
    return this.connector.cachedProvider
  }

  testSendTransaction = async (chainId: SupportedChainId) => {
    if (!this.web3) {
      return
    }

    const address = this.getAddress(chainId)

    const tx = await formatTestTransaction(address, chainId)

    try {
      // @ts-ignore
      function sendTransaction(_tx: any, web3: any) {
        return new Promise((resolve, reject) => {
          web3.eth
            .sendTransaction(_tx)
            .once('transactionHash', (txHash: string) => resolve(txHash))
            .catch((err: any) => reject(err))
        })
      }

      // send transaction
      const result = await sendTransaction(tx, this.web3)

      // format displayed result
      const formattedResult = {
        action: ETH_SEND_TRANSACTION,
        txHash: result,
        from: address,
        to: address,
        value: '0 ETH',
      }

      return formattedResult
    } catch (error) {
      console.error(error) // tslint:disable-line
    }
  }

  testSignMessage = async (chainId: SupportedChainId) => {
    if (!this.web3) {
      return
    }

    const address = this.getAddress(chainId)

    // test message
    const message = 'My email is john@doe.com - 1537836206101'

    // hash message
    const hash = hashPersonalMessage(message)

    try {
      // send message
      const result = await this.web3.eth.sign(hash, address)

      // verify signature
      const signer = recoverPublicKey(result, hash)
      const verified = signer.toLowerCase() === address.toLowerCase()

      // format displayed result
      const formattedResult = {
        action: ETH_SIGN,
        address,
        signer,
        verified,
        result,
      }

      // display result
      return formattedResult
    } catch (error) {
      console.error(error) // tslint:disable-line
    }
  }

  testSignPersonalMessage = async (chainId: SupportedChainId) => {
    if (!this.web3) {
      return
    }

    const address = this.getAddress(chainId)

    // test message
    const message = 'My email is john@doe.com - 1537836206101'

    // encode message (hex)
    const hexMsg = convertUtf8ToHex(message)

    try {
      // toggle pending request indicator

      // send message
      // @ts-ignore
      const result = await this.web3.eth.personal.sign(hexMsg, address)

      // verify signature
      const signer = recoverPersonalSignature(result, message)
      const verified = signer.toLowerCase() === address.toLowerCase()

      // format displayed result
      const formattedResult = {
        action: PERSONAL_SIGN,
        address,
        signer,
        verified,
        result,
      }

      // display result
      return formattedResult
    } catch (error) {
      console.error(error) // tslint:disable-line
    }
  }
}
