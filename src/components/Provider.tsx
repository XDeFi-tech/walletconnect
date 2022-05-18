import React, { useContext, useMemo } from 'react'
import { WalletsContext } from 'src/manager'
import styled from 'styled-components'

import { canInject, IProviderUserOptions } from '../helpers'

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
  }

  @media screen and (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`

const SProviderWrapper = styled.div`
  background: #333333;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  min-width: 180px;
  height: 104px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;

  @media screen and (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    min-height: 50px;
    height: auto;
  }
`

const STYLES = `
  width: 100%;
  cursor: pointer;
  margin-top: 14px;
  color: #ffffff;
  font-size: 16px;
  line-height: 24px;
  text-align: center;

  @media screen and (max-width: 768px) {
    margin-top: 0;
    margin-left: 16px;
  }
`

const SName = styled.div`
  ${STYLES}
`

const SLink = styled.a`
  ${STYLES}

  margin-top: 4px;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`

const SPrioritise = styled(SName)``

interface IProviderProps {
  provider: IProviderUserOptions
}

export function Provider(props: IProviderProps) {
  const { provider } = props
  const {
    name,
    logo: El,
    chains,
    id,
    installationLink,
    disabledByWalletFunc,
    needPrioritiseFunc
  } = provider
  const { ...otherProps } = props

  const context = useContext(WalletsContext)

  const supportedChains = useMemo(() => {
    return chains ? Object.keys(chains) : []
  }, [chains])

  const needInstall = useMemo(
    () => installationLink && !canInject(),
    [installationLink]
  )

  const disabledByWallet = useMemo(
    () => disabledByWalletFunc && disabledByWalletFunc(),
    [disabledByWalletFunc]
  )

  const needPrioritise = useMemo(
    () => needPrioritiseFunc && needPrioritiseFunc(),
    [needPrioritiseFunc]
  )
  const available = !disabledByWallet && !needPrioritise

  return (
    <SProviderWrapper
      {...otherProps}
      onClick={() =>
        available && context && context.connector.connectTo(id, supportedChains)
      }
    >
      <SIcon>
        <El />
      </SIcon>
      {available ? <SName>{name}</SName> : null}

      {needPrioritise && <SPrioritise>Prioritise {name} wallet</SPrioritise>}
      {disabledByWallet && (
        <SPrioritise>Disable {disabledByWallet} wallet</SPrioritise>
      )}

      {needInstall ? <SLink>Please, install {name}</SLink> : null}
    </SProviderWrapper>
  )
}
