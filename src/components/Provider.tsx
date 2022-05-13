import React, { useMemo } from 'react'
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
  width: 180px;
  height: 104px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: row;
    width: 100%;
    height: 50px;
  }
`

interface IProviderProps {
  provider: IProviderUserOptions
}

export function Provider(props: IProviderProps) {
  const { provider } = props

  const { name, logo: El, onClick, chains } = provider
  const { ...otherProps } = props

  const supportedChains = useMemo(() => {
    return chains ? Object.keys(chains) : []
  }, [chains])

  return (
    <SProviderWrapper
      {...otherProps}
      onClick={() => onClick(Object.keys(supportedChains))}
    >
      <SIcon>
        <El />
      </SIcon>
      <SName>{name}</SName>
    </SProviderWrapper>
  )
}
