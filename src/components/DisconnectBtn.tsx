import React, { useCallback, useContext } from 'react'
import { WalletsContext } from 'src'
import styled from 'styled-components'

const Btn = styled.button`
  height: 48px;
  border-radius: 8px;
  flex: none;
  align-self: stretch;
  flex-grow: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 43px;
  gap: 10px;
`

interface IProps {
  className?: string
  children: any
  providerId?: string
}

export const DisconnectBtn = ({ children, providerId, ...rest }: IProps) => {
  const context = useContext(WalletsContext)

  const handleDisconnect = useCallback(async () => {
    if (context) {
      await context.disconnect(providerId)
    }
  }, [context, providerId])

  return (
    <Btn onClick={handleDisconnect} {...rest}>
      Disconnect
    </Btn>
  )
}
