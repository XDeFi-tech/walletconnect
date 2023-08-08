import React from 'react'
import Header from 'src/components/Header'
import { SLayoutMulti } from './styleds'
import MultiAccounts from 'src/components/MultiAccounts'

const MyMultiProvidersApp = () => {
  return (
    <SLayoutMulti>
      <Header />
      <MultiAccounts />
    </SLayoutMulti>
  )
}

export default MyMultiProvidersApp
