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
  border-radius: 12px;
  padding: 0;
  display: flex;
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px;
  margin-top: 36px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-gap: 16px;
    grid-template-columns: 1fr;
    margin-top: 16px;
  `};
`

const DisconnectBtnStyled = styled(DisconnectBtn)`
  margin-top: 24px;
  cursor: pointer;
`

const ModalStyled = styled(Modal)`
  .xdeficonnector-modal-body {
    width: 432px;
    padding: 16px;
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
