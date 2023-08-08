import { IAbstractConnectorOptions } from '../../helpers'
import { createWalletClient, custom } from 'viem'

export interface IWeb3AuthConnectorOptions extends IAbstractConnectorOptions {
  chainId?: number
  clientId?: string
  chains?: any[]
}
let promiseReject: any

const subscribeAuthEvents = (web3auth: any) => {
  web3auth.on('MODAL_VISIBILITY', (isVisible: boolean) => {
    if (!isVisible && promiseReject) {
      promiseReject('User closed sign-in modal')
      promiseReject = undefined
    }
  })
}

const connectToweb3auth = async (
  Web3Auth: any,
  opts: IWeb3AuthConnectorOptions
) => {
  const options = opts || {}
  const chainId = options.chainId || '0x1'
  const clientId = options.clientId || 'localhostid'

  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: 'testnet', // mainnet, aqua,  cyan or testnet
    chainConfig: {
      chainNamespace: 'eip155',
      chainId,
      rpcTarget: `https://rpc-proxy.xdefi.services/ethereum/mainnet`
    }
  })

  subscribeAuthEvents(web3auth)

  await web3auth.initModal()

  const provider: any = await new Promise((resolve, reject) => {
    promiseReject = reject
    web3auth.connect().then(resolve)
  })

  const client = createWalletClient({
    transport: custom(provider)
  })

  ;(client as any).disconnect = () => {
    web3auth.logout()
  }

  return client
}

export default connectToweb3auth
