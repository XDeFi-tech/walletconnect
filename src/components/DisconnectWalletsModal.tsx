import React, { useEffect, useMemo } from 'react'
import { DisconnectBtn } from 'src'
import styled, { DefaultTheme } from 'styled-components'

import { DisconnectWalletProvider, DisconnectWalletsTrigger } from '.'
import { useConnectorActiveIds, useWalletsOptions } from '../hooks'
import { useWalletsModal } from './hooks'
import { Modal } from './Modal/Modal'
import ThemeProvider from './theme'

interface IModalCardStyleProps {
  maxWidth?: number
}

const SCard = styled.div<IModalCardStyleProps>`
  position: relative;
  width: 100%;
  padding: 0;
  display: flex;
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;
  flex-direction: column;
  gap: 8px;
`

const DisconnectBtnStyled = styled(DisconnectBtn)`
  cursor: pointer;
`

const ModalStyled = styled(Modal)`
  .xdeficonnector-modal-body {
    max-width: 432px;
    padding: 16px;
    gap: 16px;
  }

  .xdeficonnector-modal-header {
    padding: 16px 0;
  }
`

interface IProps {
  trigger?: any
  isDark?: boolean
  themeBuilder?: (isDark: boolean) => DefaultTheme
  className?: string
}

export const DisconnectWalletsModal = ({
  trigger: Trigger = DisconnectWalletsTrigger,
  themeBuilder,
  isDark = true,
  className
}: IProps) => {
  const { providers: userOptions } = useWalletsOptions()
  const pids = useConnectorActiveIds()

  const { isOpen, onClose, onOpen } = useWalletsModal()

  const connected = useMemo(() => {
    return userOptions.filter((item) => pids.indexOf(item.id) !== -1)
  }, [userOptions, pids])

  useEffect(() => {
    if (connected.length === 0) {
      onClose()
    }
  }, [connected, onClose])

  return (
    <ThemeProvider themeBuilder={themeBuilder} isDark={isDark}>
      <ModalStyled
        isOpen={isOpen}
        onClose={onClose}
        className={className}
        showCloseBtn={false}
        title='Disconnect wallet'
      >
        <SCard>
          {connected.map((provider: any) => {
            return provider ? (
              <DisconnectWalletProvider
                key={provider.name}
                provider={provider}
                onSelect={onClose}
              />
            ) : null
          })}
        </SCard>

        <DisconnectBtnStyled>Disconnect all</DisconnectBtnStyled>
      </ModalStyled>
      <Trigger onClick={onOpen} />
    </ThemeProvider>
  )
}
