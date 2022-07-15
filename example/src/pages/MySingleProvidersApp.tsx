import React, { useContext } from 'react'
import {
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  WalletsContext
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SContent, SLayoutSingle } from './styleds'
import AccountsBlock from 'src/components/AccountsBlock'

const MySingleProviderApp = () => {
  const context = useContext(WalletsContext)

  const resetApp = async () => {
    if (context) {
      await context.disconnect()
    }
  }

  const accounts = useConnectedSingleAccounts()

  const configs = useConnectorSingleConfigs()

  const chains = Object.keys(accounts || {})

  console.log('--- DATA ---: ', configs, accounts)

  return (
    <SLayoutSingle>
      <Column maxWidth={1200} spanHeight>
        <Header killSession={resetApp} />
        <SContent>
          {chains.map((chain: string) => {
            return (
              <AccountsBlock
                key={chain}
                chain={chain}
                accounts={accounts[chain]}
              />
            )
          })}
        </SContent>
      </Column>
    </SLayoutSingle>
  )
}

export default MySingleProviderApp
