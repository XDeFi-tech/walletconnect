import React, { Fragment, createContext, useState, useEffect } from 'react'

import { WalletsConnector } from '../wallets'
import { IProviderOptions } from '../helpers'

export const WalletsContext = createContext<WalletsConnector | null>(null)

export const NetworkManager = ({
  children,
  options,
  network,
  cacheEnabled,
  isSingleProviderEnabled = true
}: {
  children: JSX.Element
  options: IProviderOptions
  network?: string
  cacheEnabled?: boolean
  isSingleProviderEnabled?: boolean
}) => {
  const [c, setWalletsConnector] = useState<WalletsConnector | null>(null)

  useEffect(() => {
    const newConnector = new WalletsConnector(
      options,
      network,
      cacheEnabled,
      isSingleProviderEnabled
    )
    setWalletsConnector(newConnector)

    return () => {
      newConnector.dispose()
    }
  }, [options, isSingleProviderEnabled, network, cacheEnabled])

  return (
    <WalletsContext.Provider value={c}>
      <Fragment>{children}</Fragment>
    </WalletsContext.Provider>
  )
}
