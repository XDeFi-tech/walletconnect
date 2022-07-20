import React, { useState } from 'react'
import { getProviderOptions } from './utils'
import NetworkManager from '@xdefi/wallets-connector'
import MyMultiProvidersApp from './MyMultiProvidersApp'

function MultiProvidersPage() {
  const [options] = useState(() => getProviderOptions())

  return (
    <NetworkManager
      options={options}
      network='mainnet'
      cacheEnabled={true}
      isSingleProviderEnabled={false}
    >
      <MyMultiProvidersApp />
    </NetworkManager>
  )
}

export default MultiProvidersPage
