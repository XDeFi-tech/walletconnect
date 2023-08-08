import { IAbstractConnectorOptions } from '../../helpers'

export interface ICoinbaseWalletSdkConnectorOptions
  extends IAbstractConnectorOptions {
  infuraId?: string
  rpc?: { [chainId: number]: string }
  chainId?: number
  appName?: string
  appLogoUrl?: string
  darkMode?: boolean
}

const ConnectToCoinbaseWalletSdk = async (
  CoinbaseWalletSdk: any,
  opts: ICoinbaseWalletSdkConnectorOptions
) => {
  const options = opts || {}
  const infuraId = options.infuraId || ''
  const chainId = options.chainId || 1
  const appName = options.appName || ''
  const appLogoUrl = options.appLogoUrl
  const darkMode = options.darkMode || false

  let rpc = options.rpc || undefined
  if (options.infuraId && !options.rpc) {
    rpc = `https://mainnet.infura.io/v3/${infuraId}`
  }

  const coinbaseWalletSdk = new CoinbaseWalletSdk({
    appName,
    appLogoUrl,
    darkMode
  })

  const provider = coinbaseWalletSdk.makeWeb3Provider(rpc, chainId)
  await provider.enable()
  return provider
}

export default ConnectToCoinbaseWalletSdk
