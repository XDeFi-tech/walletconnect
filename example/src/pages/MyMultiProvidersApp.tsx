import React, { Fragment, useContext } from 'react'
import {
  IProviderWithAccounts,
  useConnectedMultiAccounts,
  useConnectorMultiConfigs,
  WalletsContext
} from '@xdefi/wallets-connector'
import Column from 'src/components/Column'
import Header from 'src/components/Header'
import { SLayoutMulti, SContent, SProvider, SBlock } from './styleds'
import AccountsBlock from 'src/components/AccountsBlock'
import { useMemo } from 'react'
import { uid } from 'react-uid'

const MyMultiProvidersApp = () => {
  const context = useContext(WalletsContext)

  const resetApp = async () => {
    if (context) {
      await context.disconnect()
    }
  }

  const providers = useConnectedMultiAccounts()

  const configs = useConnectorMultiConfigs()

  console.log('<--- DATA --->: ', configs, providers)

  return (
    <SLayoutMulti>
      <Column maxWidth={1200} spanHeight>
        <Header killSession={resetApp} />
        <Accounts providers={providers} />
      </Column>
    </SLayoutMulti>
  )
}

const Accounts = ({ providers }: { providers: IProviderWithAccounts }) => {
  const keys = useMemo(
    () => Object.keys(providers).filter((key) => !!providers[key]),
    [providers]
  )

  return (
    <>
      {keys.map((key, index) => {
        const chains = providers[key]

        return (
          <SBlock key={uid(providers[key], index)}>
            <SProvider>Provider: {key}</SProvider>
            {chains && (
              <SContent>
                {Object.keys(chains).map((chain: string) => {
                  const list = chains[chain]
                  return (
                    <AccountsBlock key={chain} accounts={list} chain={chain} />
                  )
                })}
              </SContent>
            )}
          </SBlock>
        )
      })}
    </>
  )
}

export default MyMultiProvidersApp
