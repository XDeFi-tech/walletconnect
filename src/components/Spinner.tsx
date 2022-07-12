import React from 'react'
import styled, { keyframes } from 'styled-components'

interface CircleSpinnerProps {
  className?: string
  hasMobileView?: boolean
}

export const CircleSpinner = ({ className }: CircleSpinnerProps) => {
  return <SpinnerAnimation className={className} />
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const SpinnerAnimation = styled.div`
  width: 24px;
  height: 24px;
  border-top: 2px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.black};
  border-bottom: 2px solid ${({ theme }) => theme.black};
  border-right: 2px solid ${({ theme }) => theme.black};
  border-radius: 100%;
  animation: ${rotate} 1s linear infinite;
`
