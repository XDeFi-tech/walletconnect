import { IAbstractConnectorOptions } from '../../helpers'

type ETHEREUM_NETWORK_TYPE =
  | 'ropsten'
  | 'rinkeby'
  | 'kovan'
  | 'mainnet'
  | 'goerli'
  | 'localhost'
  | 'matic'
  | 'mumbai'

interface NetworkParams {
  host: ETHEREUM_NETWORK_TYPE | string
  chainId?: number
  networkName?: string
}

interface VerifierStatus {
  google?: boolean
  facebook?: boolean
  reddit?: boolean
  twitch?: boolean
  discord?: boolean
}

interface LoginParams {
  verifier?: 'google' | 'facebook' | 'twitch' | 'reddit' | 'discord' | string
}

type LOGIN_TYPE =
  | 'google'
  | 'facebook'
  | 'reddit'
  | 'discord'
  | 'twitch'
  | 'apple'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'weibo'
  | 'line'
  | 'jwt'
  | 'email-password'
  | 'passwordless'

interface BaseLoginOptions {
  display?: 'page' | 'popup' | 'touch' | 'wap'
  prompt?: 'none' | 'login' | 'consent' | 'select_account'
  max_age?: string | number
  ui_locales?: string
  id_token_hint?: string
  login_hint?: string
  acr_values?: string
  scope?: string
  audience?: string
  connection?: string
  [key: string]: unknown
}

interface JwtParameters extends BaseLoginOptions {
  domain: string
  client_id?: string
  redirect_uri?: string
  leeway?: number
  verifierIdField?: string
  isVerifierIdCaseSensitive?: boolean
}

interface IntegrityParams {
  check: boolean
  hash?: string
  version?: string
}

interface WhiteLabelParams {
  defaultLanguage?: string
  logoDark: string
  logoLight: string
  topupHide?: boolean
  featuredBillboardHide?: boolean
  disclaimerHide?: boolean
  tncLink?: LocaleLinks<string>
  privacyPolicy?: LocaleLinks<string>
  contactLink?: LocaleLinks<string>
  customTranslations?: LocaleLinks<any>
}

interface LocaleLinks<T> {
  en?: T
  ja?: T
  ko?: T
  de?: T
  zh?: T
}

interface LoginConfigItem {
  name?: string
  typeOfLogin: LOGIN_TYPE
  description?: string
  clientId?: string
  logoHover?: string
  logoLight?: string
  logoDark?: string
  showOnModal?: boolean
  jwtParameters?: JwtParameters
}

interface LoginConfig {
  [verifier: string]: LoginConfigItem
}

export interface IOptions {
  buttonPosition?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  modalZIndex?: number
  apiKey?: string
  buildEnv?: 'production' | 'development' | 'staging' | 'testing' | 'lrc'
  enableLogging?: boolean
  enabledVerifiers?: VerifierStatus
  loginConfig?: LoginConfig
  showTorusButton?: boolean
  integrity?: IntegrityParams
  whiteLabel?: WhiteLabelParams
}

export interface ITorusConnectorOptions extends IAbstractConnectorOptions {
  config?: IOptions
  loginParams?: LoginParams
  networkParams?: NetworkParams
}

// Supports Torus package versions 0.2.*
const ConnectToTorus = async (Torus: any, opts: ITorusConnectorOptions) => {
  return new Promise((resolve, reject) => {
    try {
      // defaults
      const buttonPosition = 'bottom-left'
      const apiKey = 'torus-default'
      const modalZIndex = 9999999
      let network: NetworkParams = { host: 'mainnet' }
      const defaultVerifier = opts?.loginParams?.verifier

      // parsing to Torus interfaces
      network =
        opts.networkParams || opts.network
          ? { host: opts.network, ...opts.networkParams }
          : network

      const torus = new Torus({
        buttonPosition: opts.config?.buttonPosition || buttonPosition,
        apiKey: opts.config?.apiKey || apiKey,
        modalZIndex: opts.config?.modalZIndex || modalZIndex
      })

      torus
        .init({
          showTorusButton: false,
          ...opts.config,
          network
        })
        .then(() => torus.login({ verifier: defaultVerifier }))
        .then(() => {
          const provider = torus.provider
          provider.torus = torus
          resolve(provider)
        })
        .catch(reject)
    } catch (err) {
      reject(err)
    }
  })
}

export default ConnectToTorus
