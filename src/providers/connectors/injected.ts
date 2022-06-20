const ConnectToInjected = async () => {
  let provider = null

  if (window.xfi && window.xfi.ethereum) {
    provider = window.xfi.ethereum
  } else if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum
  } else if (window.web3) {
    provider = window.web3.currentProvider
  } else if (window.celo) {
    provider = window.celo
  } else {
    throw Error('No Web3 Provider found')
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
