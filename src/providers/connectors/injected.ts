const ConnectToInjected = async () => {
  let provider = null
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum
    try {
      // @ts-ignore
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      throw Error('User Rejected')
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider
  } else if (window.celo) {
    provider = window.celo
  } else {
    throw Error('No Web3 Provider found')
  }
  return provider
}

export default ConnectToInjected
