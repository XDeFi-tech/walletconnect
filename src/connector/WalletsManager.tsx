import { createContext, useEffect, useState } from 'react'

import { Wallets } from './index'
import { WalletsConnector } from './WalletsConnector'
import { IProviderOptions } from './helpers'

export const WalletsContext = createContext<WalletsConnector | null>(null)

const NetworkManager = ({
  children,
  options,
}: {
  children: JSX.Element
  options: IProviderOptions
}) => {
  const [c, setC] = useState<WalletsConnector>(
    () => new WalletsConnector(options)
  )

  useEffect(() => {
    setC(new WalletsConnector(options))
  }, [options])

  return (
    <WalletsContext.Provider value={c}>
      <Wallets />
      {children}
    </WalletsContext.Provider>
  )
}

export default NetworkManager
