import { IChainType } from 'src/constants'

export type ICoreOptions = IProviderControllerOptions

export interface IProviderControllerOptions {
  disableInjectedProvider: boolean
  cacheProviders: boolean
  providerOptions: IProviderOptions
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
  getEthereumProvider?: () => any
}

export interface ISupportedChain {
  methods: {
    signTransaction?: (data: any) => Promise<any>
    sendTransaction?: (txData: any) => Promise<any>
    getAccounts: () => Promise<any>
    request?: (type: string, data: any) => Promise<any>
  }
}

export type IChainWithAccount = { [key in IChainType]: string[] }

export type IProviderWithAccounts = { [key: string]: IChainWithAccount }

export interface IChainToAccounts {
  chain: string
  accounts: string[]
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
  getEthereumProvider?: () => any
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
  display?: IProviderInfo
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
  logo: any
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
