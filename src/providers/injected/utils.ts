import { WALLETS } from 'src/constants'

export const disabledDefault = (providerId: string) => {
  if (providerId !== WALLETS.xdefi && window.xfi && window.xfi.ethereum) {
    const { isXDEFI } = window.xfi.ethereum
    if (!isXDEFI) {
      return 'XDEFI'
    }
  }

  return undefined
}
