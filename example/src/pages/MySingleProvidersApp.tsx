import React, { useMemo } from 'react'
import {
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  useConnectedMultiAccounts
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SContent, SLayoutSingle } from './styleds'
import AccountsBlock from 'src/components/AccountsBlock'

const MySingleProviderApp = () => {
  const multi = useConnectedMultiAccounts()
  const accounts = useConnectedSingleAccounts()

  const configs = useConnectorSingleConfigs()

  const chains = useMemo(() => Object.keys(accounts || {}), [accounts])

  console.log('<--- DATA --->: ', { configs, accounts, multi })

  return (
    <SLayoutSingle>
      <Column maxWidth={1200} spanHeight>
        <Header />
        {chains && (
          <SContent>
            {accounts &&
              chains.map((chain: string) => {
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
