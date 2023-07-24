import { providers } from '../providers'

export function isCurrentProviderActive(provider: any, injected: any): boolean {
  if (!provider) {
    return false
  }

  const values = Object.values(providers)
  const target = values.find(
    ({ id, name }) => id === injected.id && name === injected.name
  )

  if (!target) {
    return false
  }

  return !!provider[target.check]
}

export function isLocalStorageAvailable() {
  const test = 'test'
  try {
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

export const findAvailableEthereumProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return window.ethereum
  } else if (window.web3) {
    return window.web3.currentProvider
  } else if (window.celo) {
    return window.celo
  }

  return undefined
}

export const canInject = () => findAvailableEthereumProvider()
