import React, { Fragment, useContext } from 'react'
import {
  IProviderWithAccounts,
  useConnectedMultiAccounts,
  useConnectorMultiConfigs,
  WalletsContext
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SLayoutMulti, SContent, SBalances } from './styleds'
import styled from 'styled-components'

const Block = styled.div`
  display: block;
  border-bottom: 2px solid black;
  padding: 16px;
`

const MyMultiProvidersApp = () => {
  const context = useContext(WalletsContext)

  const resetApp = async () => {
    if (context) {
      await context.disconnect()
    }
  }

  const providers = useConnectedMultiAccounts()

  const configs = useConnectorMultiConfigs()

  console.log('configs', configs)
  console.log('accounts', providers)
  return (
    <SLayoutMulti>
      <Column maxWidth={1200} spanHeight>
        <Header killSession={resetApp} />
        {providers && (
          <SContent>
            <Accounts providers={providers} />
          </SContent>
        )}
      </Column>
    </SLayoutMulti>
  )
}

const Accounts = ({
  chain,
  providers
}: {
  chain: string
  providers: IProviderWithAccounts
}) => {
  const keys = Object.keys(providers)

  return (
    <>
      {keys.map((key) => {
        const chains = providers[key]
        if (!chains) {
          return null
        }
        return (
          <Block key={key}>
            <div>Provider: {key}</div>

            {Object.keys(chains).map((chain: string) => {
              const list = chains[chain]
              return (
                <SBalances>
                  <h3>
                    {chain} with accounts {list ? list.join(', ') : '<not set>'}
                  </h3>
                </SBalances>
              )
            })}
          </Block>
        )
      })}
    </>
  )
}

export default MyMultiProvidersApp
