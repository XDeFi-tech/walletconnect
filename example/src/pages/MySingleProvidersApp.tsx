import React, { useContext } from 'react'
import {
  IChainWithAccount,
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  WalletsContext
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SBalances, SContent, SLayoutSingle } from './styleds'

const MySingleProviderApp = () => {
  const context = useContext(WalletsContext)

  const resetApp = async () => {
    if (context) {
      await context.disconnect()
    }
  }

  const accounts = useConnectedSingleAccounts()

  const configs = useConnectorSingleConfigs()

  console.log('configs', configs)
  console.log('accounts', accounts)

  return (
    <SLayoutSingle>
      <Column maxWidth={1200} spanHeight>
        <Header killSession={resetApp} />
        {accounts && (
          <SContent>
            {Object.keys(accounts).map((chain: string) => {
              return <Accounts key={chain} chain={chain} accounts={accounts} />
            })}
          </SContent>
        )}
      </Column>
    </SLayoutSingle>
  )
}

const Accounts = ({
  chain,
  accounts
}: {
  chain: string
  accounts: IChainWithAccount
}) => {
  const list = accounts[chain] || ([] as string[])
  return (
    <SBalances>
      <h3>
        {chain} with accounts {list ? list.join(', ') : '<not set>'}
      </h3>
    </SBalances>
  )
}

export default MySingleProviderApp
