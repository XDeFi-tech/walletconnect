import React from 'react'
import {
  useConnectedMultiAccounts,
  useConnectorMultiConfigs
} from '@xdefi/wallets-connector'
import AccountsBlock from 'src/components/AccountsBlock'
import { useMemo } from 'react'
import { SBlock, SContent, SProvider } from 'src/pages/styleds'

const MultiAccounts = () => {
  const providers = useConnectedMultiAccounts()

  const configs = useConnectorMultiConfigs()

  console.log('<--- DATA --->: ', configs, providers, Object.keys(providers))

  const keys = useMemo(() => Object.keys(providers), [providers])

  return (
    <>
      {keys.map((key) => {
        const chains = providers[key]

        console.log('key', key, chains)
        return (
          <SBlock key={key}>
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

export default MultiAccounts
