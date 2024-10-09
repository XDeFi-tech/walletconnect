import React from 'react'
import styled, { css } from 'styled-components'
import { ReactComponent as Checkmark } from '../../icons/Checkmark.svg'

interface IProps {
  className?: string
  icon: JSX.Element
  label: string
  value: string
  checked: boolean
  onClick: (value: string) => void
  disabled?: boolean
}

export const ChainCard = ({
  disabled,
  icon,
  label,
  checked,
  onClick,
  value
}: IProps) => {
  const handleClick = () => {
    onClick(value)
  }

  return (
    <Container
      className='walletconnect__select-chain--card'
      disabled={disabled}
      onClick={disabled ? undefined : handleClick}
    >
      <ChainImage className='walletconnect__select-chain--card-icon-container'>
        {icon}
        {checked ? (
          <CheckmarkWrapper>
            <Checkmark />
          </CheckmarkWrapper>
        ) : null}
      </ChainImage>
      <ChainName className='walletconnect__select-chain--card-label'>
        {label}
      </ChainName>
    </Container>
  )
}

const Container = styled.div<{ disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  grid-gap: 8px;
  flex-basis: 75px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: ${0.4};
    `}
`
const ChainName = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #fff;
  white-space: nowrap;
`

const ChainImage = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  > svg {
    height: 40px;
    width: 40px;
  }
`

const CheckmarkWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #4476f2;
  border: 2px solid #252829;
  border-radius: 50px;
`
