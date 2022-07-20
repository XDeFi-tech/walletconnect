import React, { useState } from 'react'
import { getProviderOptions } from './utils'
import NetworkManager from '@xdefi/wallets-connector'
import MySingleProviderApp from './MySingleProvidersApp'

function SingleProviderPage() {
  const [options] = useState(() => getProviderOptions())

  return (
    <NetworkManager
      options={options}
      network='mainnet'
      cacheEnabled={true}
      isSingleProviderEnabled={true}
    >
      <MySingleProviderApp />
    </NetworkManager>
  )
}

export default SingleProviderPage
