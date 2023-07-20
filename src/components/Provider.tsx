import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useConnectorActiveIds } from './../hooks'
import { WalletsContext } from 'src/manager'
import styled, { css } from 'styled-components'
import { DefaultTheme } from 'styled-components/macro'

import { ReactComponent as LinkOutSvg } from './icons/linkOut.svg'
import { ReactComponent as ArrowSvg } from './icons/Arrow.svg'
import { canInject, IProviderUserOptions } from '../helpers'
import { CircleSpinner } from './Spinner'
import { IChainType } from 'src/constants'

interface IProviderProps {
  provider: IProviderUserOptions
  onSelect: () => void
  onShowChainSelector?: () => void
}

export function WalletProvider({
  provider,
  onSelect,
  onShowChainSelector,
  ...rest
}: IProviderProps) {
  const { name, logo: El, chains, id, installationLink } = provider
  const pids = useConnectorActiveIds()
  const context = useContext(WalletsContext)
  const supportedChains = useMemo(() => {
    return chains ? (Object.keys(chains) as IChainType[]) : []
  }, [chains])

  const needInstall = useMemo(() => {
    return (
      (installationLink && !canInject()) || !context?.isAvailableProvider(id)
    )
  }, [installationLink, context, id])

  const disabledByWallet = useMemo(
    () => context && !context?.isAvailableProvider(id),
    [context, id]
  )

  const [loading, setLoading] = useState(false)

  const isActive = useMemo(() => {
    return pids.some((i) => i === id)
  }, [pids, id])

  const isAvailable = !disabledByWallet && !needInstall

  const isConnected = !!pids.find((providerId) => providerId === id)

  const connectToProvider = useCallback(async () => {
    if (isAvailable && context && !needInstall) {
      setLoading(true)
      try {
        await context.connectTo(id, supportedChains)
      } finally {
        setLoading(false)
      }
      onSelect()
    }
  }, [
    isAvailable,
    context,
    id,
    supportedChains,
    onSelect,
    setLoading,
    needInstall
  ])

  const isRecommended = id === 'xdefi'

  const handleClickProvider = () => {
    if (isRecommended) {
      onShowChainSelector?.()
      return
    }
    connectToProvider()
  }

  useEffect(() => {
    if (isActive && !isAvailable && context) {
      context?.disconnect()
    }
  }, [context, isActive, isAvailable])

  const rightPart = useMemo(() => {
    if (isConnected) {
      return <ConnectedText>Connected</ConnectedText>
    }

    if (disabledByWallet) {
      return (
        <DisabledText>
          To connect with Browser Wallet, please turn off “Prioritise XDEFI” in
          your wallet
        </DisabledText>
      )
    }

    if (needInstall && !disabledByWallet) {
      return installationLink ? (
        <SLink href={installationLink} target='_blank'>
          <span>Please install {name}</span>
          <LinkOutSvg />
        </SLink>
      ) : (
        <SLinkFallback>Please install {name}</SLinkFallback>
      )
    }

    if (isRecommended) {
      return (
        <RecommendedWrapper>
          <span>Recommended</span>
          <ArrowSvg />
        </RecommendedWrapper>
      )
    }

    if (loading) {
      return <CircleSpinnerStyled />
    }

    return null
  }, [
    disabledByWallet,
    isConnected,
    isRecommended,
    installationLink,
    name,
    needInstall,
    loading
  ])

  return (
    <SProviderWrapper
      {...rest}
      onClick={handleClickProvider}
      available={isAvailable && !isConnected}
      active={isActive}
    >
      <NameWrapper>
        <SIcon>
          {typeof El !== 'string' ? (
            <El style={{ flexShrink: 0 }} />
          ) : (
            <img src={El} />
          )}
        </SIcon>
        <SName>{name}</SName>
      </NameWrapper>
      {rightPart}
    </SProviderWrapper>
  )
}

export function DisconnectWalletProvider({
  provider,
  ...rest
}: IProviderProps) {
  const { name, logo: El, id } = provider

  const context = useContext(WalletsContext)

  const disconnectHandler = useCallback(async () => {
    context && context.disconnect(id)
  }, [context, id])

  return (
    <SProviderDisconnectWrapper {...rest} onClick={disconnectHandler}>
      <SIcon>{typeof El !== 'string' ? <El /> : <img src={El} />}</SIcon>
      <SNameDisconnect>{name}</SNameDisconnect>
    </SProviderDisconnectWrapper>
  )
}

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

const SProviderWrapper = styled.div<{
  available?: boolean
  active?: boolean
}>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  grid-gap: 12px;
  opacity: ${({ available }) => (available ? 1 : 0.4)};
  border-radius: 8px;
  cursor: ${({ available }) => (available ? 'pointer' : 'unset')};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 8px;
  `}

  &:hover {
    background-color: #111314;
  }
`

const SProviderDisconnectWrapper = styled.div<{
  available?: boolean
  active?: boolean
}>`
  opacity: ${({ available = true }) => (available ? 1 : 0.4)};
  background: ${({ theme }) => theme.wallet.bg};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 16px 44px;
  position: relative;
  flex-direction: row;
  width: 100%;
  min-height: 60px;
  height: auto;
`

const STYLES = (theme: DefaultTheme) => `
  cursor: pointer;
  color: ${theme.wallet.name};
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
`

const SName = styled.div`
  ${({ theme }) => STYLES(theme)}
`

const SNameDisconnect = styled.div`
  ${({ theme }) => STYLES(theme)}
  margin-top: 0;
  text-align: left;
  margin-left: 44px;
`

const linkStyles = css`
  display: flex;
  align-items: center;
  grid-gap: 12px;

  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.wallet.link};
  text-align: right;
`

const SLink = styled.a`
  ${linkStyles}

  &:hover {
    text-decoration: underline;
  }
`
const SLinkFallback = styled.div`
  ${linkStyles}
`

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  grid-gap: 12px;
`

const DisabledText = styled.div`
  color: ${({ theme }) => theme.wallet.disableText};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: right;
`
const RecommendedWrapper = styled.div`
  display: flex;
  align-items: center;
  grid-gap: 8px;
  color: ${({ theme }) => theme.wallet.recommendedText};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
`

const ConnectedText = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.wallet.connectedText};
`
