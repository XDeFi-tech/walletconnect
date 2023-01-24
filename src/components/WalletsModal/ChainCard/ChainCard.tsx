import React from 'react'
import styled from 'styled-components'
import { ReactComponent as Checkmark } from '../../icons/Checkmark.svg'

interface IProps {
  className?: string
  icon: JSX.Element
  label: string
  value: string
  checked: boolean
  onClick: (value: string) => void
}

export const ChainCard = ({ icon, label, checked, onClick, value }: IProps) => {
  const handleClick = () => {
    onClick(value)
  }

  return (
    <Container onClick={handleClick}>
      <ChainImage>
        {icon}
        {checked ? (
          <CheckmarkWrapper>
            <Checkmark />
          </CheckmarkWrapper>
        ) : null}
      </ChainImage>
      <ChainName>{label}</ChainName>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  grid-gap: 8px;
  cursor: pointer;
  flex: 1 1 0;
`
const ChainName = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #fff;
`

const ChainImage = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
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
