import React, { useContext, useMemo } from 'react'
import { WalletsContext } from 'src/manager'
import styled from 'styled-components'

import { IProviderUserOptions } from '../helpers'

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

const SName = styled.div`
  width: 100%;
  margin-top: 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;

  @media screen and (max-width: 768px) {
    font-size: 5vw;
    margin-top: 0;
    margin-left: 16px;
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
  }
`

const SLink = styled.a`
  cursor: pointer;
  margin-top: 4px;
  color: #ffffff;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }

  @media screen and (max-width: 768px) {
    margin-top: 0;
    margin-left: 4px;
  }
`

const SPrioritise = styled.a`
  cursor: pointer;
  margin-top: 14px;
  color: #ffffff;
  font-size: 16px;

  @media screen and (max-width: 768px) {
    margin-top: 0;
    margin-left: 4px;
  }
`

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
    () => installationLink && !window.web3 && !window.ethereum,
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

  return (
    <SProviderWrapper
      {...otherProps}
      onClick={() =>
        context && context.connector.connectTo(id, Object.keys(supportedChains))
      }
    >
      <SIcon>
        <El />
      </SIcon>
      {!disabledByWallet && !needPrioritise ? <SName>{name}</SName> : null}

      {needPrioritise && <SPrioritise>Prioritise {name} wallet</SPrioritise>}
      {disabledByWallet && <SPrioritise>Disable {name} wallet</SPrioritise>}

      {needInstall ? <SLink>Please, install {name}</SLink> : null}
    </SProviderWrapper>
  )
}
