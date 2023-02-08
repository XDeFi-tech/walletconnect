import { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { isEqual } from 'lodash'

import { WALLETS_EVENTS } from '../constants'
import {
  IProviderConfigs,
  IProviderWithAccounts,
  IProviderWithChains,
  IWalletConnectorConfigs,
  IWeb3Providers
} from '../helpers'
import { WalletsContext } from '../manager'

export const useConnectorActiveIds = () => {
  const context = useContext(WalletsContext)
  const [pids, setPids] = useState<string[]>(() => context?.providers || [])

  useEffect(() => {
    if (context?.providers) {
      setPids([...context?.providers])
    }
  }, [context?.providers, setPids])

  const setConfigs = useCallback(
    (c: string[] = []) => {
      setPids(c)
    },
    [setPids]
  )

  useEffect(() => {
    if (context) {
      setConfigs(context?.providers)
    }
  }, [context, setConfigs])

  useEffect(() => {
    if (!context) {
      return
    }

    const listUns = context.on(
      WALLETS_EVENTS.UPDATED_PROVIDERS_LIST,
      setConfigs
    )
    return () => {
      listUns && listUns()
    }
  }, [context, setConfigs])

  return pids
}

const useSingleSelectedProvider = () => {
  const pids = useConnectorActiveIds()
  return pids[0]
}

export const useConnectorMultiConfigs = () => {
  const context = useContext(WalletsContext)

  const [configs, setConfigsState] = useState<IProviderConfigs>(
    () => context?.configs || ({} as IProviderConfigs)
  )

  const setConfigs = useCallback(
    (c: IProviderConfigs) => {
      setConfigsState({
        ...c
      })
    },
    [setConfigsState]
  )

  useEffect(() => {
    if (context) {
      setConfigs(context?.configs)
    }
  }, [context, setConfigs])

  useEffect(() => {
    if (!context) {
      return
    }
    const connectInfoUns = context.on(
      WALLETS_EVENTS.CONNECTION_INFO,
      setConfigs
    )

    return () => {
      connectInfoUns && connectInfoUns()
    }
  }, [context, setConfigs])

  return configs
}

export const useConnectorSingleConfigs = (): IWalletConnectorConfigs => {
  const configs = useConnectorMultiConfigs()
  const active = useSingleSelectedProvider()
  return configs[active]
}

export const useConnectorMultiProviders = () => {
  const context = useContext(WalletsContext)

  const [providers, setCurrentProviders] = useState<IWeb3Providers>(
    () => context?.currentProviders || {}
  )

  const setProviderHandler = useCallback(
    (data: any) => {
      const { providerId, provider } = data
      if (provider) {
        setCurrentProviders((state) => ({
          ...state,
          [providerId]: provider
        }))
      } else {
        setCurrentProviders((store) => {
          const state = { ...store }
          delete state[providerId]
          return state
        })
      }
    },
    [setCurrentProviders]
  )

  useEffect(() => {
    if (context?.currentProviders) {
      setProviderHandler(context?.currentProviders)
    }
  }, [context?.currentProviders, setProviderHandler])

  useEffect(() => {
    if (!context) {
      return
    }
    const provUns = context.on(
      WALLETS_EVENTS.CURRENT_PROVIDER,
      setProviderHandler
    )

    return () => {
      provUns && provUns()
    }
  }, [context, setProviderHandler])

  return providers
}

export const useConnectorSingleProvider = () => {
  const providers = useConnectorMultiProviders()
  const active = useSingleSelectedProvider()
  return providers[active]
}

export const useConnectorMultiChains = () => {
  const context = useContext(WalletsContext)

  const [injectedChains, setInjectedChains] = useState<IProviderWithChains>(
    () => context?.getInjectedChains() || {}
  )

  const setChainsHandler = useCallback(
    (data) => {
      const { providerId, chains } = data
      setInjectedChains((state) => ({
        ...state,
        [providerId]: chains
      }))
    },
    [setInjectedChains]
  )

  useEffect(() => {
    if (context) {
      setChainsHandler(context?.getInjectedChains())
    }
  }, [context, setChainsHandler])

  useEffect(() => {
    if (!context) {
      return
    }

    const chainsUns = context.on(
      WALLETS_EVENTS.CONNECTED_CHAINS,
      setChainsHandler
    )
    return () => {
      chainsUns && chainsUns()
    }
  }, [context, setChainsHandler])

  return {
    injectedChains
  }
}

export const useConnectorSingleChains = () => {
  const configs = useConnectorMultiChains()
  const active = useSingleSelectedProvider()
  return configs[active]
}

export const useConnectedMultiAccounts = () => {
  const context = useContext(WalletsContext)

  const [accounts, setAccounts] = useState<IProviderWithAccounts>(
    () => context?.getAccounts() || {}
  )

  const setAccountsHandler = useCallback(
    (newList: IProviderWithAccounts) => {
      setAccounts((stored) => {
        if (!isEqual(stored, newList)) {
          return { ...newList }
        }
        return stored
      })
    },
    [setAccounts]
  )

  useEffect(() => {
    if (context) {
      setAccountsHandler(context?.getAccounts() || {})
    }
  }, [context, setAccountsHandler])

  useEffect(() => {
    if (!context) {
      return
    }
    const accUns = context.on(WALLETS_EVENTS.ACCOUNTS, setAccountsHandler)

    return () => {
      accUns && accUns()
    }
  }, [context, setAccountsHandler])

  return accounts
}

export const useWalletEvents = (
  onConnect?: () => void,
  onClose?: () => void,
  onError?: (e: any) => void
) => {
  const context = useContext(WalletsContext)

  useEffect(() => {
    if (!context) {
      return
    }
    const connectUnsubscrive =
      onConnect && context.on(WALLETS_EVENTS.CONNECT, onConnect)
    const closeUnsubscribe =
      onClose && context.on(WALLETS_EVENTS.DISCONNECTED, onClose)
    const errorUnsubscribe =
      onError && context.on(WALLETS_EVENTS.ERROR, onError)

    return () => {
      if (context) {
        connectUnsubscrive && connectUnsubscrive()
        closeUnsubscribe && closeUnsubscribe()
        errorUnsubscribe && errorUnsubscribe()
      }
    }
  }, [context, onConnect, onClose, onError])
}

export const useConnectedSingleAccounts = () => {
  const accounts = useConnectedMultiAccounts()
  const active = useSingleSelectedProvider()
  return accounts[active]
}

export const useWalletsOptions = () => {
  const context = useContext(WalletsContext)

  const providers = useMemo(() => {
    return context ? context.connector.getUserOptions() : []
  }, [context])

  const onDisconnect = useCallback(
    (providerId?: string) => {
      return context?.disconnect(providerId)
    },
    [context]
  )

  return {
    providers,
    onDisconnect
  }
}
