import React from 'react'
import {
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  useConnectorSingleProvider
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SContent, SLayoutSingle } from './styleds'
import AccountsBlock from 'src/components/AccountsBlock'
import { useMemo } from 'react'

const MySingleProviderApp = () => {
  const accounts: any = useConnectedSingleAccounts()

  const configs = useConnectorSingleConfigs()
  const provider = useConnectorSingleProvider()

  const chains = useMemo(() => Object.keys(accounts || {}), [accounts])

  console.log('<--- DATA --->: ', configs, accounts, provider)

  return (
    <SLayoutSingle>
      <Column maxWidth={1200} spanHeight>
        <Header />
        {chains && (
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
        )}
      </Column>
    </SLayoutSingle>
  )
}

export default MySingleProviderApp
