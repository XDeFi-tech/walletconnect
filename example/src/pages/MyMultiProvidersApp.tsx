import React, { useContext } from 'react'
import {
  IChainWithAccount,
  useConnectedSingleAccounts,
  useConnectorSingleConfigs,
  WalletsContext
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SLayoutMulti, SContent, SBalances } from './styleds'

const MyMultiProvidersApp = () => {
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
    <SLayoutMulti>
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
    </SLayoutMulti>
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

export default MyMultiProvidersApp
