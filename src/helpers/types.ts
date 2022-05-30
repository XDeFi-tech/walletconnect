import { IChainType } from 'src/constants'

export type ICoreOptions = IProviderControllerOptions

export interface IProviderControllerOptions {
  disableInjectedProvider: boolean
  cacheProvider: boolean
  providerOptions: IProviderOptions
  network: string
}

export interface IAbstractConnectorOptions {
  network: string
}

export interface IInjectedProvidersMap {
  injectedAvailable: boolean | undefined
  [isProviderName: string]: boolean | undefined
}

export interface IProviderDisplay {
  name: string
  logo: any
  description?: string
}

export interface ISupportedChain {
  methods: {
    signTransaction?: (txData: any) => Promise<any>
    sendTransaction?: (txData: any) => Promise<any>
    getAccounts: () => Promise<any>
    request?: (type: string, data: any) => Promise<any>
  }
}

export type IChainWithAccount = { [key in IChainType]?: string }

export interface IChainToAccounts {
  chain: string
  account: string
}

export interface IProviderInfo extends IProviderDisplay {
  id: string
  type: string
  check: string
  package?: IProviderPackageOptions
  chains?: {
    [name: string]: ISupportedChain
  }
  supportedEvmChains?: IChainType[]
  installationLink?: string
  disabledByWalletFunc?: () => string | undefined
  needPrioritiseFunc?: () => boolean
}

export type RequiredOption = string | string[]

export interface IProviderPackageOptions {
  required?: RequiredOption[]
}

export interface IProviderOption {
  package: any
  options?: any
  connector?: Connector
  display?: Partial<IProviderDisplay>
}

export interface IProviderOptions {
  [id: string]: IProviderOption
}

export interface IProviderDisplayWithConnector extends IProviderDisplay {
  id: string
  connector: any
  package?: IProviderPackageOptions
}

export interface IProviderUserOptions {
  id: string
  name: string
  logo: string
  description: string
  onClick: (chains?: string[]) => Promise<void>
  chains?: {
    [name: string]: ISupportedChain
  }
  installationLink?: string
  disabledByWalletFunc?: () => string | undefined
  needPrioritiseFunc?: () => boolean
  supportedEvmChains?: IChainType[]
}

export type SimpleFunction = (input?: any) => void

export interface IEventCallback {
  event: string
  callback: (result: any) => void
}

export type ChainData = {
  chainId: number
  chain: string
  network: string
  networkId: number
}

export type ChainDataList = {
  [chainId: number]: ChainData
}

export type Connector = (provider?: any, opts?: any) => Promise<any>

export interface IConnectorsMap {
  [id: string]: Connector
}

export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  LOCAL_TESTNET = 31337,
  BSC = 56,
  FANTOM = 250,
  AVALANCHE = 0xa86a
}

export const CHAIN_DATA_LIST: ChainDataList = {
  1: {
    chainId: 1,
    chain: 'ETH',
    network: 'mainnet',
    networkId: 1
  },
  2: {
    chainId: 2,
    chain: 'EXP',
    network: 'expanse',
    networkId: 1
  },
  3: {
    chainId: 3,
    chain: 'ETH',
    network: 'ropsten',
    networkId: 3
  },
  4: {
    chainId: 4,
    chain: 'ETH',
    network: 'rinkeby',
    networkId: 4
  },
  5: {
    chainId: 5,
    chain: 'ETH',
    network: 'goerli',
    networkId: 5
  },
  6: {
    chainId: 6,
    chain: 'ETC',
    network: 'kotti',
    networkId: 6
  },
  8: {
    chainId: 8,
    chain: 'UBQ',
    network: 'ubiq',
    networkId: 88
  },
  9: {
    chainId: 9,
    chain: 'UBQ',
    network: 'ubiq-testnet',
    networkId: 2
  },
  10: {
    chainId: 10,
    chain: 'ETH',
    network: 'optimism',
    networkId: 10
  },
  11: {
    chainId: 11,
    chain: 'META',
    network: 'metadium',
    networkId: 11
  },
  12: {
    chainId: 12,
    chain: 'META',
    network: 'metadium-testnet',
    networkId: 12
  },
  18: {
    chainId: 18,
    chain: 'TST',
    network: 'thundercore-testnet',
    networkId: 18
  },
  22: {
    chainId: 22,
    chain: 'LYX',
    network: 'lukso-l14-testnet',
    networkId: 22
  },
  23: {
    chainId: 23,
    chain: 'LYX',
    network: 'lukso-l15-testnet',
    networkId: 23
  },
  25: {
    chainId: 25,
    chain: 'CRO',
    network: 'cronos',
    networkId: 25
  },
  30: {
    chainId: 30,
    chain: 'RSK',
    network: 'rsk',
    networkId: 30
  },
  31: {
    chainId: 31,
    chain: 'RSK',
    network: 'rsk-testnet',
    networkId: 31
  },
  42: {
    chainId: 42,
    chain: 'ETH',
    network: 'kovan',
    networkId: 42
  },
  56: {
    chainId: 56,
    chain: 'BSC',
    network: 'binance',
    networkId: 56
  },
  60: {
    chainId: 60,
    chain: 'GO',
    network: 'gochain',
    networkId: 60
  },
  61: {
    chainId: 61,
    chain: 'ETC',
    network: 'etc',
    networkId: 1
  },
  62: {
    chainId: 62,
    chain: 'ETC',
    network: 'etc-morden',
    networkId: 2
  },
  63: {
    chainId: 63,
    chain: 'ETC',
    network: 'etc-testnet',
    networkId: 7
  },
  64: {
    chainId: 64,
    chain: 'ELLA',
    network: 'ellaism',
    networkId: 64
  },
  69: {
    chainId: 69,
    chain: 'ETH',
    network: 'optimism-kovan',
    networkId: 69
  },
  76: {
    chainId: 76,
    chain: 'MIX',
    network: 'mix',
    networkId: 76
  },
  77: {
    chainId: 77,
    chain: 'POA',
    network: 'poa-sokol',
    networkId: 77
  },
  88: {
    chainId: 88,
    chain: 'TOMO',
    network: 'tomochain',
    networkId: 88
  },
  97: {
    chainId: 97,
    chain: 'BSC',
    network: 'binance-testnet',
    networkId: 97
  },
  99: {
    chainId: 99,
    chain: 'POA',
    network: 'poa-core',
    networkId: 99
  },
  100: {
    chainId: 100,
    chain: 'XDAI',
    network: 'xdai',
    networkId: 100
  },
  101: {
    chainId: 101,
    chain: 'ETI',
    network: 'etherinc',
    networkId: 1
  },
  108: {
    chainId: 108,
    chain: 'TT',
    network: 'thundercore',
    networkId: 108
  },
  162: {
    chainId: 162,
    chain: 'PHT',
    network: 'sirius',
    networkId: 162
  },
  163: {
    chainId: 163,
    chain: 'PHT',
    network: 'lightstreams',
    networkId: 163
  },
  211: {
    chainId: 211,
    chain: 'FTN',
    network: 'freight',
    networkId: 0
  },
  250: {
    chainId: 250,
    chain: 'FTM',
    network: 'fantom',
    networkId: 250
  },
  269: {
    chainId: 269,
    chain: 'HPB',
    network: 'hpb',
    networkId: 100
  },
  338: {
    chainId: 338,
    chain: 'CRO',
    network: 'cronos-testnet',
    networkId: 338
  },
  385: {
    chainId: 385,
    chain: 'CRO',
    network: 'lisinski',
    networkId: 385
  },
  820: {
    chainId: 820,
    chain: 'CLO',
    network: 'callisto',
    networkId: 1
  },
  821: {
    chainId: 821,
    chain: 'CLO',
    network: 'callisto-testnet',
    networkId: 2
  },
  137: {
    chainId: 137,
    chain: 'MATIC',
    network: 'matic',
    networkId: 137
  },
  1284: {
    chainId: 1284,
    chain: 'GLMR',
    network: 'moonbeam',
    networkId: 1284
  },
  1285: {
    chainId: 1285,
    chain: 'MOVR',
    network: 'moonriver',
    networkId: 1285
  },
  42161: {
    chainId: 42161,
    chain: 'ETH',
    network: 'arbitrum',
    networkId: 42161
  },
  42220: {
    chainId: 42220,
    chain: 'CELO',
    network: 'celo',
    networkId: 42220
  },
  44787: {
    chainId: 44787,
    chain: 'CELO',
    network: 'celo-alfajores',
    networkId: 44787
  },
  62320: {
    chainId: 62320,
    chain: 'CELO',
    network: 'celo-baklava',
    networkId: 62320
  },
  80001: {
    chainId: 80001,
    chain: 'MUMBAI',
    network: 'mumbai',
    networkId: 80001
  },
  43113: {
    chainId: 43113,
    chain: 'AVAX',
    network: 'avalanche-fuji-testnet',
    networkId: 43113
  },
  43114: {
    chainId: 43114,
    chain: 'AVAX',
    network: 'avalanche-fuji-mainnet',
    networkId: 43114
  },
  246529: {
    chainId: 246529,
    chain: 'ARTIS sigma1',
    network: 'artis-s1',
    networkId: 246529
  },
  246785: {
    chainId: 246785,
    chain: 'ARTIS tau1',
    network: 'artis-t1',
    networkId: 246785
  },
  1007: {
    chainId: 1007,
    chain: 'NewChain TestNet',
    network: 'newchain-testnet',
    networkId: 1007
  },
  1012: {
    chainId: 1012,
    chain: 'NewChain MainNet',
    network: 'newchain-mainnet',
    networkId: 1012
  },
  421611: {
    chainId: 421611,
    chain: 'ETH',
    network: 'arbitrum-rinkeby',
    networkId: 421611
  },
  1666600000: {
    chainId: 1666600000,
    chain: 'ONE',
    network: 'harmony-shard1',
    networkId: 1666600000
  },
  1313161554: {
    chainId: 1313161554,
    chain: 'AETH',
    network: 'aurora',
    networkId: 1313161554
  }
}
