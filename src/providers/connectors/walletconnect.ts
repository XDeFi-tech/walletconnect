export interface IWalletConnectConnectorOptions {
  projectId: string
  chains: number[]
  showQrModal: boolean
}

const ConnectToWalletConnect = async (
  WalletConnectProvider: any,
  opts: IWalletConnectConnectorOptions
) => {
  const provider = await WalletConnectProvider.init(opts)

  if (!provider.connected) {
    await provider.connect()
  }

  return provider
}

export default ConnectToWalletConnect
