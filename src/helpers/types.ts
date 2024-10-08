import { IChainType } from 'src/constants'

export type Network = {
  name: string
  chainId: number
  ensAddress?: string
  _defaultProvider?: (providers: any, options?: any) => any
}

export interface IConnectEventPayload {
  provider: any
  id: string
}

export type ICoreOptions = IProviderControllerOptions

export interface IProviderControllerOptions {
  cacheProviders: boolean
  providerOptions: IProviderOptions
}

export interface ISupportedChain {
  methods: {
    signTransaction?: (data: any) => Promise<any>
    sendTransaction?: (txData: any) => Promise<any>
    getAccounts: (provider?: any) => Promise<any>
    request?: (type: string, data: any) => Promise<any>
    getProvider?: () => any
  }
}

export type IChainWithAccount = { [key in IChainType]: string[] }

export type IProviderWithAccounts = {
  [providerId: string]: IChainWithAccount | null
}

export interface IChainToAccounts {
  chain: IChainType
  accounts: string[]
}

export interface IProviderConfigs {
  [providerId: string]: {
    network: string
    chainId: number
  }
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
  [key: string]: IChainType[]
}

export interface IWeb3Providers {
  [key: string]: any
}

export interface IProviderInfo {
  name: string
  logo: any
  description?: string
  id: string
  type: string
  check: string | ((provider: any) => boolean)
  package?: IProviderPackageOptions
  chains?: {
    [name: string]: ISupportedChain
  }
  installationLink?: string
  getEthereumProvider?: () => any
}

export interface IProviderDisplayWithConnector extends IProviderInfo {
  connector: any
}

export interface IProviderUserOptions {
  id: string
  name: string
  logo: any
  chains?: {
    [name: string]: ISupportedChain
  }
  installationLink?: string
}

export type SimpleFunction = (input?: any) => void

export interface IEventCallback {
  event: string
  callback: (result: any) => void
}

export type Connector = (provider?: any, opts?: any) => Promise<any>
