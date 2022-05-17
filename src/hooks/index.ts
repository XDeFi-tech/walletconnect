import { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { provider as Provider } from 'web3-core'
import Web3 from 'web3'

import { IChainType, WALLETS_EVENTS } from '../constants'
import { IChainWithAccount, IProviderInfo } from '../helpers'
import { WalletsContext } from '../manager'

export const useWalletsConnector = () => {
  const context = useContext(WalletsContext)

  const [wallet, setCurrentWallet] = useState<IProviderInfo | null>(null)
  const [injectedChains, setInjectedChains] = useState<string[]>([])
  const [web3provider, setWeb3CurrentProvider] = useState<Web3 | null>(null)
  const [provider, setCurrentProvider] = useState<Provider | null>(null)

  const setWeb3ProviderHandler = useCallback(
    (provider: Web3) => {
      setWeb3CurrentProvider(provider)
    },
    [setWeb3CurrentProvider]
  )

  const setProviderHandler = useCallback(
    (provider: Provider) => {
      setCurrentProvider(provider)
    },
    [setCurrentProvider]
  )

  const setWalletHandler = useCallback(
    (provider: IProviderInfo) => {
      setCurrentWallet(provider)
    },
    [setCurrentWallet]
  )

  const setChainsHandler = useCallback(
    (newList: string[]) => {
      setInjectedChains(newList)
    },
    [setInjectedChains]
  )

  useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.CURRENT_WALLET, setWalletHandler)
      context.on(WALLETS_EVENTS.CONNECTED_CHAINS, setChainsHandler)
      context.on(WALLETS_EVENTS.CURRENT_WEB3_PROVIDER, setWeb3ProviderHandler)
      context.on(WALLETS_EVENTS.CURRENT_PROVIDER, setProviderHandler)
    }

    return () => {
      if (context) {
        context.off(WALLETS_EVENTS.CURRENT_WALLET, setWalletHandler)
        context.off(WALLETS_EVENTS.CONNECTED_CHAINS, setChainsHandler)
        context.on(WALLETS_EVENTS.CURRENT_WEB3_PROVIDER, setWeb3ProviderHandler)
        context.on(WALLETS_EVENTS.CURRENT_PROVIDER, setProviderHandler)
      }
    }
  }, [context])

  return {
    wallet,
    injectedChains,
    web3provider,
    provider
  }
}

export const useConnectedAccounts = () => {
  const context = useContext(WalletsContext)

  const [accounts, setAccounts] = useState<IChainWithAccount>({})

  const setAccountsHandler = useCallback(
    (newList: IChainWithAccount) => {
      setAccounts(newList)
    },
    [setAccounts]
  )

  useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.ACCOUNTS, setAccountsHandler)
    }

    return () => {
      if (context) {
        context.off(WALLETS_EVENTS.ACCOUNTS, setAccountsHandler)
      }
    }
  }, [context])

  return accounts
}

export const useWalletEvents = (
  onConnect?: () => void,
  onClose?: () => void,
  onError?: (e: any) => void
) => {
  const context = useContext(WalletsContext)

  useEffect(() => {
    if (context) {
      onConnect && context.on(WALLETS_EVENTS.CONNECT, onConnect)
      onClose && context.on(WALLETS_EVENTS.CLOSE, onClose)
      onError && context.on(WALLETS_EVENTS.ERROR, onError)
    }

    return () => {
      if (context) {
        context.off(WALLETS_EVENTS.CONNECT, onConnect)
        context.off(WALLETS_EVENTS.CLOSE, onClose)
        context.off(WALLETS_EVENTS.ERROR, onError)
      }
    }
  }, [context, onConnect, onClose, onError])
}

export const useWalletsOptions = () => {
  const context = useContext(WalletsContext)

  const providers = useMemo(() => {
    return context ? context.connector.getUserOptions() : []
  }, [context])

  const onDisconnect = useCallback(() => {
    return context?.disconnect()
  }, [context])

  return {
    providers,
    onDisconnect
  }
}

export const useSign = () => {
  const context = useContext(WalletsContext)
  const sign = useCallback(
    async (chainId: IChainType, hash: string) => {
      if (!context) {
        return
      }

      // hash message
      return await context.signMessage(chainId, hash)
    },
    [context]
  )

  return sign
}

export const useSignAvailability = (chainId: IChainType) => {
  const context = useContext(WalletsContext)

  return useMemo(() => {
    if (!context) {
      return false
    }

    return context.isSignAvailable(chainId)
  }, [context, chainId])
}
