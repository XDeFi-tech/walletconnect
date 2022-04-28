import { createContext } from 'react'
import Torus from '@toruslabs/torus-embed'

import { Wallets } from './index'
import { NetworkConnector } from './ProviderConnector'
import { IProviderOptions } from './helpers'

const getProviderOptions = (): IProviderOptions => {
  const providerOptions = {
    torus: {
      package: Torus,
    },
  }
  return providerOptions
}

const connect = new NetworkConnector(getProviderOptions())

export const NetworkContext = createContext<NetworkConnector>(connect)

const NetworkManager = ({ children }: { children: JSX.Element }) => {
  return (
    <NetworkContext.Provider value={connect}>
      <Wallets />
      {children}
    </NetworkContext.Provider>
  )
}

export default NetworkManager
