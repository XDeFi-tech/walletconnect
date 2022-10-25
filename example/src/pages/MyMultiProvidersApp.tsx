import React from 'react'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SLayoutMulti } from './styleds'
import MultiAccounts from 'src/components/MultiAccounts'

const MyMultiProvidersApp = () => {
  return (
    <SLayoutMulti>
      <Column maxWidth={1200} spanHeight>
        <Header />
        <MultiAccounts />
      </Column>
    </SLayoutMulti>
  )
}

export default MyMultiProvidersApp
