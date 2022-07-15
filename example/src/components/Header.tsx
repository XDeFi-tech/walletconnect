import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import { WalletsModal, useWalletEvents } from '@xdefi/wallets-connector'

import { transitions } from '../styles'

import Banner from './Banner'
import { CUSTOM_THEME_BUILDER } from 'src/pages/utils'

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
  margin-left: 12px;
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
  grid-template-columns: 1fr 1fr 1fr;
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

const Header = (props: IHeaderProps) => {
  const { killSession } = props

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

  return (
    <SHeader>
      {isConnected ? <SActiveChain>Connected</SActiveChain> : <Banner />}
      <SAddress>
        <WalletsModal
          isDark={true}
          trigger={(props: any) => (
            <BtnOpen {...props}>Connect Dark Modal</BtnOpen>
          )}
        />

        <WalletsModal
          isDark={false}
          trigger={(props: any) => (
            <BtnOpen {...props}>Connect Light Modal</BtnOpen>
          )}
        />

        <WalletsModal
          themeBuilder={CUSTOM_THEME_BUILDER}
          isDark={true}
          trigger={(props: any) => (
            <BtnOpen {...props}>Connect Styled Modal</BtnOpen>
          )}
        />
      </SAddress>
      {isConnected && (
        <SActiveAccount>
          <BtnOpen onClick={killSession}>Disconnect</BtnOpen>
        </SActiveAccount>
      )}
    </SHeader>
  )
}

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
}

export default Header
