import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { useConnectorMultiChains, useWalletsOptions } from '../../hooks'
import { useWalletsModal } from '../hooks'
import { Modal, CloseModalSvg } from '../Modal/Modal'
import { WalletProvider } from '../Provider'
import ThemeProvider from '../theme'
import { ReactComponent as BackArrowSvg } from '../icons/backArrow.svg'
import { SelectChainSection } from './SelectChainSection'
import { WalletsContext } from '../../manager'

interface IProps {
  trigger: any
  isDark?: boolean
  themeBuilder?: (isDark: boolean) => DefaultTheme
  className?: string
  forceReconnectChains?: boolean
}

export const WalletsModal = ({
  trigger: Trigger,
  themeBuilder,
  isDark = true,
  className,
  forceReconnectChains
}: IProps) => {
  const { providers: userOptions } = useWalletsOptions()
  const { isOpen, onClose, onOpen } = useWalletsModal()
  const context = useContext(WalletsContext)

  const multiChains = useConnectorMultiChains()

  const [isChainSelectorVisible, setIsChainSelectorVisible] =
    useState<boolean>(false)

  const isXdefiWalletConnected = !!multiChains?.injectedChains?.xdefi
  const isCtrlWalletConnected = !!multiChains?.injectedChains?.ctrl
  const shouldForceReconnectChains =
    forceReconnectChains && (isXdefiWalletConnected || isCtrlWalletConnected)

  useEffect(() => {
    if (shouldForceReconnectChains) {
      setIsChainSelectorVisible(true)
      onOpen()
    }
  }, [shouldForceReconnectChains])

  const handleShowChainSelector = useCallback(() => {
    setIsChainSelectorVisible(true)
  }, [setIsChainSelectorVisible])

  const handleHideChainSelector = useCallback(() => {
    setIsChainSelectorVisible(false)
  }, [setIsChainSelectorVisible])

  const handleCloseModal = useCallback(() => {
    handleHideChainSelector()
    onClose()
  }, [onClose, handleHideChainSelector])

  const shouldShowXdefi = context?.isAvailableProvider('xdefi')

  const xdefiLikeProvider = useMemo(() => {
    if (!userOptions || userOptions.length === 0) return null
    return userOptions.find((item) =>
      shouldShowXdefi ? item.id === 'xdefi' : item.id === 'ctrl'
    )
  }, [userOptions, shouldShowXdefi])

  const userOptionsToRender = useMemo(() => {
    return shouldShowXdefi
      ? userOptions
      : userOptions.filter((opt) => opt.id !== 'xdefi')
  }, [userOptions, shouldShowXdefi])

  return (
    <ThemeProvider themeBuilder={themeBuilder} isDark={isDark}>
      <StyledModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        className={className}
        renderHeader={
          isChainSelectorVisible
            ? () =>
                shouldForceReconnectChains ? (
                  <CustomHeader>
                    <TitleAlignmentPlaceholder />
                    <Title>Update selected chains</Title>
                    <CloseModalSvg onClick={handleCloseModal} />
                  </CustomHeader>
                ) : (
                  <CustomHeader>
                    <SBackArrowSvg onClick={handleHideChainSelector} />
                    <Title>Select chains</Title>
                    <CloseModalSvg onClick={handleCloseModal} />
                  </CustomHeader>
                )
            : undefined
        }
      >
        {isChainSelectorVisible ? (
          <SelectChainSection
            provider={xdefiLikeProvider}
            onSelect={handleCloseModal}
            reconnectChains={shouldForceReconnectChains}
          />
        ) : (
          <SRow>
            {userOptionsToRender.map((provider: any) =>
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
  .xdeficonnector-modal-body {
    max-width: 530px;
    padding: 16px;
    gap: 16px;

    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      max-width: unset;
    `}
  }
`

const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #f2f1f1;
`

const SRow = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const CustomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px 0;
`

const SBackArrowSvg = styled(BackArrowSvg)`
  cursor: pointer;
  width: 20px;
  height: 20px;
`

const TitleAlignmentPlaceholder = styled.div``
