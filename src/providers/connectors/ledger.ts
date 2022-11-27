import { IAbstractConnectorOptions } from '../../helpers'

export interface ILedgerConnectorOptions extends IAbstractConnectorOptions {
  chainId?: number
  providerType?: string
  infuraId?: string
  rpc?: Record<string, string>
}

const connectToLedger = async (
  LedgerConnectKit: any,
  opts: ILedgerConnectorOptions
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = opts || {}
      const chainId = options.chainId || 1
      const infuraId = options.infuraId
      const providerType = options.providerType || 'Ethereum'
      const rpc = options.rpc || {}

      const connectKit = await LedgerConnectKit()
      connectKit.checkSupport({
        chainId,
        providerType,
        infuraId,
        rpc
      })

      const provider = await connectKit.getProvider()
      provider.ledger = connectKit
      resolve(provider)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

export default connectToLedger
