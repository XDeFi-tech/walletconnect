import { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { IWalletConnectorConfigs } from 'src'

import { IChainType, WALLETS_EVENTS } from '../constants'
import { IChainWithAccount } from '../helpers'
import { WalletsContext } from '../manager'

export const useConnectionConfigs = () => {
  const context = useContext(WalletsContext)

  const [configs, setConfigsState] = useState<IWalletConnectorConfigs>(
    () => context?.configs || ({} as IWalletConnectorConfigs)
  )

  const setConfigs = useCallback(
    (c: IWalletConnectorConfigs) => {
      setConfigsState(c)
    },
    [setConfigsState]
  )

  useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.CONFIGS, setConfigs)
    }

    return () => {
      if (context) {
        context.off(WALLETS_EVENTS.CONFIGS, setConfigs)
      }
    }
  }, [context])

  return configs
}

export const useWalletsConnector = () => {
  const context = useContext(WalletsContext)

  const [injectedChains, setInjectedChains] = useState<string[]>(
    () => context?.connector?.injectedChains || []
  )
  const [provider, setCurrentProvider] = useState<any>(
    () => context?.currentProvider
  )

  const setProviderHandler = useCallback(
    (provider: any) => {
      setCurrentProvider(provider)
    },
    [setCurrentProvider]
  )

  const setChainsHandler = useCallback(
    (newList: string[]) => {
      setInjectedChains(newList)
    },
    [setInjectedChains]
  )

  useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.CONNECTED_CHAINS, setChainsHandler)
      context.on(WALLETS_EVENTS.CURRENT_PROVIDER, setProviderHandler)
    }

    return () => {
      if (context) {
        context.off(WALLETS_EVENTS.CONNECTED_CHAINS, setChainsHandler)
        context.off(WALLETS_EVENTS.CURRENT_PROVIDER, setProviderHandler)
      }
    }
  }, [context])

  return {
    injectedChains,
    provider
  }
}

export const useConnectedAccounts = () => {
  const context = useContext(WalletsContext)

  const [accounts, setAccounts] = useState<IChainWithAccount>(
    () => context?.getAccounts() || {}
  )

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
    async (chainId: IChainType, data: any) => {
      if (!context) {
        return
      }
      return await context.signMessage(chainId, data)
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

export const useWalletRequest = () => {
  const context = useContext(WalletsContext)
  const onRequest = useCallback(
    async (chainId: IChainType, method: string, params: any) => {
      if (!context) {
        return
      }

      return await context.request(chainId, method, params)
    },
    [context]
  )

  return onRequest
}

export const useRequestAvailability = (chainId: IChainType) => {
  const context = useContext(WalletsContext)

  return useMemo(() => {
    if (!context) {
      return false
    }

    return context.isRequestAvailable(chainId)
  }, [context, chainId])
}
