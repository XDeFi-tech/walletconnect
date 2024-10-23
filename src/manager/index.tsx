import React, { Fragment, createContext, useState, useEffect } from 'react'

import { WalletsConnector } from '../wallets'
import { IConnectorOptions, IProviderOptions } from '../helpers'

export const WalletsContext = createContext<WalletsConnector | null>(null)

export const NetworkManager = ({
  children,
  options,
  network,
  cacheEnabled,
  connectorOptions
}: {
  children: JSX.Element
  options: IProviderOptions
  network?: string
  cacheEnabled?: boolean
  connectorOptions?: IConnectorOptions
}) => {
  const [c, setWalletsConnector] = useState<WalletsConnector | null>(null)

  useEffect(() => {
    const newConnector = new WalletsConnector(
      options,
      cacheEnabled,
      connectorOptions
    )
    setWalletsConnector(newConnector)

    return () => {
      newConnector.dispose()
    }
  }, [options, network, cacheEnabled, connectorOptions])

  return (
    <WalletsContext.Provider value={c}>
      <Fragment>{children}</Fragment>
    </WalletsContext.Provider>
  )
}
