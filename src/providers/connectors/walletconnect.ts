export interface IWalletConnectConnectorOptions {
  projectId: string
  chains: number[]
  showQrModal: boolean
}

let provider: any

const ConnectToWalletConnect = async (
  WalletConnectProvider: any,
  opts: IWalletConnectConnectorOptions
) => {
  if (!provider) {
    provider = await WalletConnectProvider.init(opts)
  }

  if (!provider.session) {
    await provider.connect()
  }

  return provider
}

export default ConnectToWalletConnect
