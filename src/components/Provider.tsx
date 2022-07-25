import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useConnectorActiveIds } from './../hooks'
import { WalletsContext } from 'src/manager'
import styled from 'styled-components'
import { DefaultTheme } from 'styled-components/macro'

import { canInject, IProviderUserOptions } from '../helpers'
import { CircleSpinner } from './Spinner'

const CircleSpinnerStyled = styled(CircleSpinner)`
  position: absolute;
  right: 12px;
  top: 12px;
`

const SIcon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  overflow: visible;
  box-shadow: none;
  justify-content: center;
  align-items: center;

  & svg {
    width: 28px;
    height: 28px;
    fill: ${({ theme }) => theme.black};
  }

  & img {
    width: 28px;
    height: 28px;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 32px;
    height: 32px;
  `};
`

const SProviderWrapper = styled.div<{ available: boolean; active: boolean }>`
  opacity: ${({ available }) => (available ? 1 : 0.4)};
  background: ${({ theme }) => theme.wallet.bg};
  background: ${({ theme, active }) =>
    active ? theme.wallet.activeBg : theme.wallet.bg};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  min-width: 180px;
  height: 104px;
  padding: 12px 24px;
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction: row;
  width: 100%;
  min-height: 50px;
  height: auto;
  `};
`

const STYLES = (theme: DefaultTheme) => `
  width: 100%;
  cursor: pointer;
  margin-top: 14px;
  color: ${theme.wallet.name};
  font-size: 16px;
  line-height: 24px;
  text-align: center;

  ${theme.mediaWidth.upToExtraSmall`
    margin-top: 0;
    margin-left: 16px;
  `};
`

const SName = styled.div`
  ${({ theme }) => STYLES(theme)}
`

const SLink = styled.a`
  ${({ theme }) => STYLES(theme)}

  margin-top: 4px;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`
const SLinkFallback = styled.div`
  ${({ theme }) => STYLES(theme)}

  margin-top: 4px;
  font-size: 12px;
`

const SPrioritise = styled(SName)``

interface IProviderProps {
  provider: IProviderUserOptions
  onSelect: () => void
}

export function Provider({ provider, onSelect, ...rest }: IProviderProps) {
  const {
    name,
    logo: El,
    chains,
    id,
    installationLink,
    disabledByWalletFunc,
    needPrioritiseFunc
  } = provider

  const pids = useConnectorActiveIds()

  const context = useContext(WalletsContext)

  const supportedChains = useMemo(() => {
    return chains ? Object.keys(chains) : []
  }, [chains])

  const needInstall = useMemo(() => {
    return (
      (installationLink && !canInject()) || !context?.isAvailableProvider(id)
    )
  }, [installationLink, context])

  const disabledByWallet = useMemo(
    () => disabledByWalletFunc && disabledByWalletFunc(),
    [disabledByWalletFunc]
  )

  const needPrioritise = useMemo(
    () => needPrioritiseFunc && needPrioritiseFunc(),
    [needPrioritiseFunc]
  )

  const [loading, setLoading] = useState(false)
  const isActive = useMemo(() => {
    return pids.some((i) => i === id)
  }, [pids, id])

  console.log(id, isActive, needInstall)

  const isAvailable = !disabledByWallet && !needPrioritise && !needInstall

  const connectToProvider = useCallback(async () => {
    if (isAvailable && context && !needInstall) {
      setLoading(true)
      if (context?.connector?.isSingleProviderEnabled) {
        if (!isActive) {
          context.disconnect()
          await context.connector.connectTo(id, supportedChains)
        }
      } else {
        if (!isActive) {
          await context.connector.connectTo(id, supportedChains)
        } else {
          context.disconnect(id)
        }
      }
      setLoading(false)
      onSelect()
    }
  }, [
    isAvailable,
    context,
    context?.connector,
    id,
    supportedChains,
    onSelect,
    setLoading,
    isActive,
    needInstall
  ])

  useEffect(() => {
    if (isActive && !isAvailable && context) {
      context?.disconnect()
    }
  }, [context, isActive, isAvailable])

  return (
    <SProviderWrapper
      {...rest}
      onClick={connectToProvider}
      available={isAvailable}
      active={isActive}
    >
      <SIcon>{typeof El !== 'string' ? <El /> : <img src={El} />}</SIcon>
      {isAvailable ? <SName>{name}</SName> : null}

      {needPrioritise && <SPrioritise>Prioritise {name} wallet</SPrioritise>}
      {disabledByWallet && (
        <SPrioritise>Disable {disabledByWallet} wallet</SPrioritise>
      )}

      {needInstall ? (
        installationLink ? (
          <SLink href={installationLink} target='_blank'>
            Please, install {name}
          </SLink>
        ) : (
          <SLinkFallback>Please, install {name}</SLinkFallback>
        )
      ) : null}

      {loading && <CircleSpinnerStyled />}
    </SProviderWrapper>
  )
}
