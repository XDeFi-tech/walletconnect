import { Network } from '@ethersproject/providers'
import { IChainType } from 'src/constants'
import { ChainData } from '.'

export type ICoreOptions = IProviderControllerOptions

export interface IProviderControllerOptions {
  disableInjectedProvider: boolean
  cacheProviders: boolean
  providerOptions: IProviderOptions
  network: string
  isSingleProviderEnabled?: boolean
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

export type IProviderWithAccounts = {
  [providerId: string]: IChainWithAccount | null
}

export interface IChainToAccounts {
  chain: string
  accounts: string[]
}

export type IWalletConnectorConfigs = Network &
  ChainData & { activeAddress?: string }

export interface IProviderConfigs {
  [providerId: string]: IWalletConnectorConfigs
}

export interface IProviderInfo extends IProviderDisplay {
  id: string
  type: string
  check: string
  package?: IProviderPackageOptions
  chains?: {
    [name: string]: ISupportedChain
  }
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
  package?: any
  options?: any
  connector?: Connector
  display?: IProviderInfo
}

export interface IProviderOptions {
  [id: string]: IProviderOption
}

export interface IProviderWithChains {
  [key: string]: string[]
}

export interface IWeb3Providers {
  [key: string]: any
}

export interface IProviderDisplayWithConnector extends IProviderDisplay {
  id: string
  connector: any
  package?: IProviderPackageOptions
  chains?: {
    [name: string]: ISupportedChain
  }
  disabledByWalletFunc?: () => string | undefined
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
  label?: string
  pids: any
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
