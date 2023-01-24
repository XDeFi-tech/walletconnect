import React, { FC, MouseEvent, ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { ReactComponent as ThreeDotsLoader } from '../icons/ThreeDotsLoader.svg'

export interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  onClick?: (event?: MouseEvent<HTMLButtonElement>) => void
  loading?: boolean
  label: string
  dataTestId?: string
}

interface PrimaryButtonWrapperProps {
  fullWidth?: boolean
  type?: 'button' | 'reset' | 'submit'
  disabled?: boolean
  isLoading: boolean
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  onClick = () => null,
  label = '',
  className,
  dataTestId = 'primary-button',
  fullWidth = false,
  disabled = false,
  type = 'button',
  loading = false,
  ...restProps
}) => {
  return (
    <PrimaryButtonWrapper
      role='button'
      fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${className} XdefiPrimaryButton-root`}
      isLoading={loading}
      data-testid={dataTestId}
      {...restProps}
    >
      {loading ? (
        <ThreeDotsLoader />
      ) : (
        <LabelWrapper className='XdefiPrimaryButton-labelRoot'>
          <Typography className='XdefiPrimaryButton-typography'>
            {label}
          </Typography>
        </LabelWrapper>
      )}
    </PrimaryButtonWrapper>
  )
}

export const PrimaryButtonWrapper = styled.button<PrimaryButtonWrapperProps>`
  border-radius: 8px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  padding: 0 15px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-width: 148px
  color: #fff;
  background-color: #4476F2;
  border: none;

  &[disabled] {
    color: #969da3;
    background-color: #111314;
  }

  &:hover:not([disabled]),
  &:focus:not([disabled]) {
    background-color: #0b1114;
  }

  &:focus:not([disabled]) {
    border: 1px solid #fff;
  }
`

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-grow: 1;
  justify-content: center;
`

const Typography = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
`
