import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import {
  IChainType,
  useWalletsConnector,
  WalletsModal,
  useBalance,
  useWalletEvents
} from '@xdefi/wallets-connector'

import { transitions } from '../styles'

import Banner from './Banner'

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`

const SActiveChain = styled(SActiveAccount)`
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`

const SAddress = styled.div`
  transition: ${transitions.base};
  font-weight: bold;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
  margin-left: auto;
`

const BtnOpen = styled.button`
  max-width: 154px;
  width: 154px;
  border-radius: 8px;
  padding: 0 15px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

interface IHeaderProps {
  killSession: () => void
}

const CUSTOM_THEME: any = {
  // base
  white: '#0969da',
  black: '#9a6700',
  modal: {
    bg: '#ddf4ff'
  },
  wallet: {
    descColor: '#1a7f37',
    titleColor: '#bc4c00',
    bg: '#fbefff'
  },
  wallets: { grid: '1fr 1fr' }
}

const Header = (props: IHeaderProps) => {
  const { killSession } = props

  const { provider: wallet } = useWalletsConnector()

  const [isConnected, setIsConnected] = useState(false)

  const onConnectHandler = useCallback(() => {
    setIsConnected(true)
  }, [setIsConnected])
  const onErrorHandler = useCallback(() => {
    setIsConnected(false)
  }, [setIsConnected])
  const onCloseHandler = useCallback(() => {
    setIsConnected(false)
  }, [setIsConnected])

  useWalletEvents(onConnectHandler, onCloseHandler, onErrorHandler)

  const ethBalance = useBalance(IChainType.ethereum)

  return (
    <SHeader>
      {wallet ? (
        <SActiveChain>Connected {ethBalance.toString()} ETH</SActiveChain>
      ) : (
        <Banner />
      )}
      {isConnected ? (
        <SActiveAccount>
          <BtnOpen onClick={killSession}>{'Disconnect'}</BtnOpen>
        </SActiveAccount>
      ) : (
        <SAddress>
          <WalletsModal
            trigger={(props: any) => <BtnOpen {...props}>Connect</BtnOpen>}
          />
          <WalletsModal
            theme={CUSTOM_THEME}
            trigger={(props: any) => (
              <BtnOpen {...props}>Connect Styled Modal</BtnOpen>
            )}
          />
        </SAddress>
      )}
    </SHeader>
  )
}

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
}

export default Header
