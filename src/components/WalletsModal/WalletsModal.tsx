import React, { useState } from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { useWalletsOptions } from '../../hooks'
import { useWalletsModal } from '../hooks'
import { Modal, CloseModalSvg } from '../Modal/Modal'
import { WalletProvider } from '../Provider'
import ThemeProvider from '../theme'
import { ReactComponent as BackArrowSvg } from '../icons/backArrow.svg'
import { SelectChainSection } from './SelectChainSection'

interface IProps {
  trigger: any
  isDark?: boolean
  themeBuilder?: (isDark: boolean) => DefaultTheme
  className?: string
}

export const WalletsModal = ({
  trigger: Trigger,
  themeBuilder,
  isDark = true,
  className
}: IProps) => {
  const [isChainSelectorVisible, setIsChainSelectorVisible] =
    useState<boolean>(false)
  const { providers: userOptions } = useWalletsOptions()
  const { isOpen, onClose, onOpen } = useWalletsModal()

  const handleShowChainSelector = () => {
    setIsChainSelectorVisible(true)
  }

  const handleHideChainSelector = () => {
    setIsChainSelectorVisible(false)
  }

  const handleCloseModal = () => {
    handleHideChainSelector()
    onClose()
  }

  return (
    <ThemeProvider themeBuilder={themeBuilder} isDark={isDark}>
      <StyledModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className={className}
        renderHeader={
          isChainSelectorVisible
            ? () => (
                <CustomHeader>
                  <SBackArrowSvg onClick={handleHideChainSelector} />
                  <CloseModalSvg onClick={onClose} />
                </CustomHeader>
              )
            : undefined
        }
      >
        {isChainSelectorVisible ? (
          <SelectChainSection />
        ) : (
          <SRow>
            {userOptions.map((provider: any) =>
              provider ? (
                <WalletProvider
                  key={provider.name}
                  provider={provider}
                  onSelect={onClose}
                  onShowChainSelector={handleShowChainSelector}
                />
              ) : null
            )}
          </SRow>
        )}
      </StyledModal>
      <Trigger onClick={onOpen} />
    </ThemeProvider>
  )
}

const StyledModal = styled(Modal)`
  padding: 20px 0;

  .xdeficonnector-modal-body {
    overflow: auto;
  }
`

const SRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
`

const CustomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 20px 0;
`

const SBackArrowSvg = styled(BackArrowSvg)`
  cursor: pointer;
`
