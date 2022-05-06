import { createContext, useEffect, useState } from 'react'

import { Wallets } from './index'
import { WalletsConnector } from './WalletsConnector'
import { IProviderOptions } from './helpers'

export const WalletsContext = createContext<WalletsConnector | null>(null)

export const NetworkManager = ({
  children,
  options,
  network,
  cacheEnabled,
}: {
  children: JSX.Element
  options: IProviderOptions
  network?: string
  cacheEnabled?: boolean
}) => {
  const [c, setC] = useState<WalletsConnector>(
    () => new WalletsConnector(options, network, cacheEnabled)
  )

  useEffect(() => {
    setC(new WalletsConnector(options, network, cacheEnabled))
  }, [options, network, cacheEnabled])

  return (
    <WalletsContext.Provider value={c}>
      <Wallets />
      {children}
    </WalletsContext.Provider>
  )
}
