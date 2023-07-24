import { findAvailableEthereumProvider } from 'src'

const ConnectToInjected = async () => {
  const provider = findAvailableEthereumProvider()

  if (!provider) {
    throw Error('No Web3 Provider found')
  }

  if (provider) {
    try {
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      throw Error('User Rejected')
    }
  }
  return provider
}

export default ConnectToInjected
