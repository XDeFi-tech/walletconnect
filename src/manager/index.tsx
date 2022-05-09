import * as React from 'react'

import { Wallets } from '../index'
import { WalletsConnector } from '../wallets'
import { IProviderOptions } from '../helpers'

export const WalletsContext = React.createContext<WalletsConnector | null>(null)

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
  const [c, setC] = React.useState<WalletsConnector>(
    () => new WalletsConnector(options, network, cacheEnabled)
  )

  React.useEffect(() => {
    setC(new WalletsConnector(options, network, cacheEnabled))
  }, [options, network, cacheEnabled])

  return (
    <WalletsContext.Provider value={c}>
      <Wallets />
      {children}
    </WalletsContext.Provider>
  )
}
