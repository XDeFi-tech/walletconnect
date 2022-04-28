import * as React from 'react'
import styled from 'styled-components'

const SIcon = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  border-radius: 50%;
  overflow: visible;
  box-shadow: none;
  justify-content: center;
  align-items: center;
  & img {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 768px) {
    width: 8.5vw;
    height: 8.5vw;
  }
`

const SName = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
  margin-top: 0.5em;
  @media screen and (max-width: 768px) {
    font-size: 5vw;
  }
`

const SDescription = styled.div`
  width: 100%;
  font-size: 18px;
  margin: 0.333em 0;
  @media screen and (max-width: 768px) {
    font-size: 4vw;
  }
`

const SProviderContainer = styled.div`
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 24px 16px;
  @media screen and (max-width: 768px) {
    padding: 1vw;
  }
`

const SProviderWrapper = styled.div`
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 0;
  @media (hover: hover) {
    &:hover ${SProviderContainer} {
    }
  }
`

interface IProviderProps {
  name: string
  logo: string
  description: string
  onClick: () => void
}

export function Provider(props: IProviderProps) {
  const { name, logo, description, onClick, ...otherProps } = props
  return (
    <SProviderWrapper onClick={onClick} {...otherProps}>
      <SProviderContainer>
        <SIcon>
          <img src={logo} alt={name} />
        </SIcon>
        <SName>{name}</SName>
        <SDescription>{description}</SDescription>
      </SProviderContainer>
    </SProviderWrapper>
  )
}
