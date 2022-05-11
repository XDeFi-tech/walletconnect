import { useContext, useState, useEffect, useMemo } from 'react'
import { IChainWithAccount, IProviderInfo } from '../helpers'
import { WalletsContext } from '../manager'
import { WALLETS_EVENTS } from '../wallets'

export const useWalletsConnector = () => {
  const context = useContext(WalletsContext)

  const [provider, setCurrentProvider] = useState<IProviderInfo | null>(null)
  const [injectedChains, setInjectedChains] = useState<string[]>([])

  useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.CURRENT_WALLET, (provider: IProviderInfo) => {
        setCurrentProvider(provider)
      })

      context.on(WALLETS_EVENTS.CONNECTED_CHAINS, (newList: string[]) => {
        setInjectedChains(newList)
      })
    }
  }, [context])

  return {
    provider,
    injectedChains
  }
}

export const useConnectedAccounts = () => {
  const context = useContext(WalletsContext)

  const [accounts, setAccounts] = useState<IChainWithAccount>({})

  useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.ACCOUNTS, (newList: IChainWithAccount) => {
        setAccounts(newList)
      })
    }
  }, [context])

  return accounts
}

export const useWalletsOptions = () => {
  const context = useContext(WalletsContext)

  return useMemo(() => {
    return context ? context.connector.getUserOptions() : []
  }, [context])
}
