import { findAvailableEthereumProvider } from 'src'

const ConnectToInjected = async (
  providerPackage: any,
  opts: any,
  chains?: string[],
  getProvider?: () => any
) => {
  let provider = getProvider ? getProvider() : undefined

  if (!provider) {
    provider = findAvailableEthereumProvider()

    if (!provider) {
      throw Error('No Web3 Provider found')
    }
  }

  if (provider) {
    try {
      // @ts-ignore
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      throw Error('User Rejected')
    }
  }
  return provider
}

export default ConnectToInjected
