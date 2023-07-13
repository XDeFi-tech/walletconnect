import React, { useCallback, useContext, useEffect, useState } from 'react'
import { WalletsContext, WALLETS_EVENTS } from '@xdefi/wallets-connector'
import AccountsBlock from 'src/components/AccountsBlock'
import { useMemo } from 'react'
import { SBlock, SContent, SProvider } from 'src/pages/styleds'

const MultiAccounts = () => {
  const [providers, setProviders] = useState({} as any)
  const context: any = useContext(WalletsContext as any)

  const handleAccounts = useCallback((accounts: any) => {
    setProviders(accounts)
  }, [])

  useEffect(() => {
    const ctx = context
    if (ctx) {
      context.on(WALLETS_EVENTS.ACCOUNTS, handleAccounts)
    }

    return () => {
      ctx.off(WALLETS_EVENTS.ACCOUNTS, handleAccounts)
    }
  }, [context, handleAccounts])

  const keys = useMemo(() => Object.keys(providers), [providers])

  return (
    <>
      {keys.map((key) => {
        const chains = providers[key]

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
