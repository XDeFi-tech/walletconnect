import { useContext, useCallback, useMemo } from 'react'
import { WalletsContext, IChainType } from 'src'

export const useSign = () => {
  const context = useContext(WalletsContext)
  const sign = useCallback(
    async (providerId: string, chainId: IChainType, data: any) => {
      if (!context) {
        return
      }
      return await context.signMessage(providerId, chainId, data)
    },
    [context]
  )

  return sign
}
export const useSignAvailability = (
  providerId: string,
  chainId: IChainType
) => {
  const context = useContext(WalletsContext)

  return useMemo(() => {
    if (!context) {
      return false
    }

    return context.isSignAvailable(providerId, chainId)
  }, [context, chainId])
}

export const useWalletRequest = () => {
  const context = useContext(WalletsContext)

  const onRequest = useCallback(
    async (
      providerId: string,
      chainId: IChainType,
      method: string,
      params: any
    ) => {
      if (!context) {
        return
      }

      return await context.request(providerId, chainId, method, params)
    },
    [context]
  )

  return onRequest
}

export const useRequestAvailability = (
  providerId: string,
  chainId: IChainType
) => {
  const context = useContext(WalletsContext)

  return useMemo(() => {
    if (!context) {
      return false
    }

    return context.isRequestAvailable(providerId, chainId)
  }, [context, chainId])
}
