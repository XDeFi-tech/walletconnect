import { useContext, useCallback, useMemo } from 'react'
import { WalletsContext, IChainType } from 'src'

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

export const useRequestAvailability = ({
  providerId,
  chainId
}: {
  providerId?: string
  chainId: IChainType
}) => {
  const context = useContext(WalletsContext)

  return useMemo(() => {
    if (!context) {
      return false
    }

    return context.isRequestAvailable({ providerId, chainId })
  }, [context, chainId])
}
