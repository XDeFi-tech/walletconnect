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

  provider.removeAllListeners = provider.events.removeAllListeners.bind(
    provider.events
  )

  if (!provider.session) {
    await provider.connect()
  }

  return provider
}

export default ConnectToWalletConnect
