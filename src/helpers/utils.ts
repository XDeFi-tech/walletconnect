import * as env from 'detect-browser'
import ReactDOMServer from 'react-dom/server'

import { providers, injected } from '../providers'

import { IProviderInfo, IInjectedProvidersMap, RequiredOption } from './types'

export function encodeSvg(reactElement: any) {
  return (
    'data:image/svg+xml,' +
    escape(ReactDOMServer.renderToStaticMarkup(reactElement))
  )
}

export function checkInjectedProviders(): IInjectedProvidersMap {
  const result: any = {
    injectedAvailable: canInject()
  }
  if (result.injectedAvailable) {
    let fallbackProvider = true
    Object.values(injected).forEach((provider) => {
      const isAvailable = verifyInjectedProvider(provider.check)
      if (isAvailable) {
        result[provider.check] = true
        fallbackProvider = false
      }
    })

    const browser = env.detect()

    if (browser && browser.name === 'opera') {
      result[injected.OPERA.check] = true
      fallbackProvider = false
    }

    if (fallbackProvider) {
      result[injected.FALLBACK.check] = true
    }
  }

  return result
}

export function verifyInjectedProvider(check: string): boolean {
  return window.ethereum
    ? // @ts-ignore
      window.ethereum[check]
    : window.web3 &&
        window.web3.currentProvider &&
        window.web3.currentProvider[check]
}

export function getInjectedProvider(): IProviderInfo | null {
  let result = null

  const injectedProviders = checkInjectedProviders()

  if (injectedProviders.injectedAvailable) {
    delete injectedProviders.injectedAvailable
    const checks = Object.keys(injectedProviders)

    result = getProviderInfoFromChecksArray(checks)
  }
  return result
}

export function getInjectedProviderName(): string | null {
  const injectedProvider = getInjectedProvider()
  return injectedProvider ? injectedProvider.name : null
}

export function getProviderInfo(provider: any): IProviderInfo {
  if (!provider) return providers.FALLBACK
  const checks = Object.values(providers)
    .filter((x) => provider[x.check])
    .map((x) => x.check)
  return getProviderInfoFromChecksArray(checks)
}

export function isCurrentProviderActive(provider: any, injected: any): boolean {
  if (!provider) {
    return false
  }

  const values = Object.values(providers)
  const target = values.find(
    ({ id, name }) => id === injected.id && name === injected.name
  )

  if (!target) {
    return false
  }

  return !!provider[target.check]
}

export function getProviderInfoFromChecksArray(
  checks: string[]
): IProviderInfo {
  const check = filterProviderChecks(checks)
  return filterProviders('check', check)
}

export function getProviderInfoByName(name: string | null): IProviderInfo {
  return filterProviders('name', name)
}

export function getProviderInfoById(id: string | null): IProviderInfo {
  return filterProviders('id', id)
}

export function getProviderInfoByCheck(check: string | null): IProviderInfo {
  return filterProviders('check', check)
}

export function getProviderDescription(
  providerInfo: Partial<IProviderInfo>
): string {
  if (providerInfo.description) {
    return providerInfo.description
  }
  let description = ''
  switch (providerInfo.type) {
    case 'injected':
      description = `Connect to your ${providerInfo.name} Wallet`
      break
    case 'web':
      description = `Connect with your ${providerInfo.name} account`
      break
    case 'qrcode':
      description = `Scan with ${providerInfo.name} to connect`
      break
    case 'hardware':
      description = `Connect to your ${providerInfo.name} Hardware Wallet`
      break
    default:
      break
  }
  return description
}

export function filterMatches<T>(
  array: T[],
  condition: (x: T) => boolean,
  fallback: T | undefined
): T | undefined {
  let result = fallback
  const matches = array.filter(condition)

  if (!!matches && matches.length) {
    result = matches[0]
  }

  return result
}

export const canInject = () => findAvailableEthereumProvider()

export function filterProviders(
  param: string,
  value: string | null
): IProviderInfo {
  if (!value) return providers.FALLBACK
  const match = filterMatches<IProviderInfo>(
    Object.values(providers),
    // @ts-ignore
    (x) => x[param] === value,
    providers.FALLBACK
  )
  return match || providers.FALLBACK
}

export function filterProviderChecks(checks: string[]): string {
  if (!!checks && checks.length) {
    if (checks.length > 1) {
      if (
        checks[0] === injected.XDEFI.check ||
        checks[0] === injected.METAMASK.check ||
        checks[0] === injected.CIPHER.check
      ) {
        return checks[1]
      }
    }
    return checks[0]
  }
  return providers.FALLBACK.check
}

export function findMatchingRequiredOptions(
  requiredOptions: RequiredOption[],
  providedOptions: { [key: string]: any }
): RequiredOption[] {
  const matches = requiredOptions.filter((requiredOption) => {
    if (typeof requiredOption === 'string') {
      return requiredOption in providedOptions
    }
    const matches = findMatchingRequiredOptions(requiredOption, providedOptions)
    return matches && matches.length
  })
  return matches
}

export function isLocalStorageAvailable() {
  const test = 'test'
  try {
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

export const findAvailableEthereumProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return window.ethereum
  } else if (window.web3) {
    return window.web3.currentProvider
  } else if (window.xfi && window.xfi.ethereum) {
    return window.xfi.ethereum
  } else if (window.celo) {
    return window.celo
  }

  return undefined
}
