import { useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { WALLETS_EVENTS } from '../constants'
import {
  IProviderConfigs,
  IProviderWithChains,
  IWeb3Providers
} from '../helpers'
import { WalletsContext } from '../manager'
import { IChainType } from '../constants'

export const useConnectorActiveIds = () => {
  const context = useContext(WalletsContext)
  const [pids, setPids] = useState<string[]>(
    () => context?.cachedProviders || []
  )

  useEffect(() => {
    if (context?.cachedProviders) {
      setPids([...context?.cachedProviders])
    }
  }, [context?.cachedProviders, setPids])

  const setConfigs = useCallback(
    (c: string[] = []) => {
      setPids(c)
    },
    [setPids]
  )

  useEffect(() => {
    if (context) {
      setConfigs(context?.cachedProviders)
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

export const useConnectorMultiChains = () => {
  const context = useContext(WalletsContext)

  const [injectedChains, setInjectedChains] = useState<IProviderWithChains>(
    () => context?.getInjectedChains() || {}
  )

  const setChainsHandler = useCallback(
    (data: any) => {
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

// Used in webapp
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

// Used in webapp
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

// Used in webapp
export const useWalletsOptions = () => {
  const context = useContext(WalletsContext)

  const providers = useMemo(() => {
    return context ? context.connector.getUserOptions() : []
  }, [context])

  return {
    providers
  }
}

export const useWalletRequest = () => {
  const context = useContext(WalletsContext)

  const onRequest = useCallback(
    async ({
      providerId,
      chainId,
      method,
      params
    }: {
      providerId?: string
      chainId: IChainType
      method: string
      params: any
    }) => {
      if (!context) {
        return
      }

      return await context.request({ providerId, chainId, method, params })
    },
    [context]
  )

  return onRequest
}
