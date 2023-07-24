export interface IWalletConnectConnectorOptions {
  projectId: string
  chains: number[]
  showQrModal: boolean
}

const ConnectToWalletConnect = (
  WalletConnectProvider: any,
  opts: IWalletConnectConnectorOptions
): Promise<any> => {
  return new Promise((resolve, reject) => {
    WalletConnectProvider.init(opts)
      .then((provider: any) => {
        provider.removeAllListeners = provider.events.removeAllListeners.bind(
          provider.events
        )
        return resolve(provider)
      })
      .catch(reject)
  })
}

export default ConnectToWalletConnect
