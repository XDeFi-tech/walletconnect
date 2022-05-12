const ConnectToInjected = async () => {
  let provider = null
  if (typeof window.ethereum !== 'undefined') {
    provider = window.ethereum
    try {
      // @ts-ignore
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      console.log('User Rejected')
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider
  } else if (window.celo) {
    provider = window.celo
  } else {
    console.log('No Web3 Provider found')
  }
  return provider
}

export default ConnectToInjected
