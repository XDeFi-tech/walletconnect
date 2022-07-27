import { ReactComponent as WalletConnectLogo } from '../logos/walletconnect-circle.svg'
import { ReactComponent as PortisLogo } from '../logos/portis.svg'
import { ReactComponent as FortmaticLogo } from '../logos/fortmatic.svg'
import { ReactComponent as VenlyLogo } from '../logos/venly.svg'
import { ReactComponent as TorusLogo } from '../logos/torus.svg'
import { ReactComponent as AuthereumLogo } from '../logos/authereum.svg'
import { ReactComponent as BitskiLogo } from '../logos/bitski.svg'
import { ReactComponent as FrameLogo } from '../logos/frame.svg'
import { ReactComponent as BinanceChainWalletLogo } from '../logos/binancechainwallet.svg'
import { ReactComponent as CoinbaseWalletLogo } from '../logos/coinbasewallet.svg'
import { ReactComponent as SequenceLogo } from '../logos/sequence.svg'
import { ReactComponent as Web3AuthLogo } from '../logos/web3auth.svg'
import { IProviderInfo } from '../../helpers'

export * from '../injected'

export const WALLETCONNECT: IProviderInfo = {
  id: 'walletconnect',
  name: 'WalletConnect',
  logo: WalletConnectLogo,
  type: 'qrcode',
  check: 'isWalletConnect',
  package: {
    required: [['infuraId', 'rpc']]
  }
}

export const PORTIS: IProviderInfo = {
  id: 'portis',
  name: 'Portis',
  logo: PortisLogo,
  type: 'web',
  check: 'isPortis',
  package: {
    required: ['id']
  }
}

export const FORTMATIC: IProviderInfo = {
  id: 'fortmatic',
  name: 'Fortmatic',
  logo: FortmaticLogo,
  type: 'web',
  check: 'isFortmatic',
  package: {
    required: ['key']
  }
}

export const TORUS: IProviderInfo = {
  id: 'torus',
  name: 'Torus',
  logo: TorusLogo,
  type: 'web',
  check: 'isTorus'
}

export const VENLY: IProviderInfo = {
  id: 'venly',
  name: 'Venly',
  logo: VenlyLogo,
  type: 'web',
  check: 'isVenly',
  package: {
    required: ['clientId']
  }
}

export const AUTHEREUM: IProviderInfo = {
  id: 'authereum',
  name: 'Authereum',
  logo: AuthereumLogo,
  type: 'web',
  check: 'isAuthereum'
}

export const BITSKI: IProviderInfo = {
  id: 'bitski',
  name: 'Bitski',
  logo: BitskiLogo,
  type: 'web',
  check: 'isBitski',
  package: {
    required: ['clientId', 'callbackUrl']
  }
}

export const FRAME: IProviderInfo = {
  id: 'frame',
  name: 'Frame',
  logo: FrameLogo,
  type: 'web',
  check: 'isFrameNative'
}

export const BINANCECHAINWALLET: IProviderInfo = {
  id: 'binancechainwallet',
  name: 'Binance Chain',
  logo: BinanceChainWalletLogo,
  type: 'injected',
  check: 'isBinanceChainWallet',
  getEthereumProvider: () => {
    return window.BinanceChain
  }
}

/**
 * @deprecated Use CoinbaseWalletSdk
 */
export const WALLETLINK: IProviderInfo = {
  id: 'walletlink',
  name: 'Coinbase Wallet',
  logo: CoinbaseWalletLogo,
  type: 'qrcode',
  check: 'isWalletLink',
  package: {
    required: [['appName', 'infuraId', 'rpc']]
  }
}

export const COINBASEWALLET: IProviderInfo = {
  id: 'coinbasewallet',
  name: 'Coinbase',
  logo: CoinbaseWalletLogo,
  type: 'injected',
  check: 'isWalletLink',
  package: {
    required: [['appName', 'infuraId', 'rpc']]
  }
}

export const SEQUENCE: IProviderInfo = {
  id: 'sequence',
  name: 'Sequence',
  logo: SequenceLogo,
  type: 'web',
  check: 'isSequenceWeb'
}

export const WEB3AUTH: IProviderInfo = {
  id: 'web3auth',
  name: 'Web3Auth',
  logo: Web3AuthLogo,
  type: 'injected',
  check: 'isWeb3Auth'
}
