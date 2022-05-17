import React, { Fragment } from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import {
  IChainType,
  IChainWithAccount,
  useConnectedAccounts,
  useWalletsConnector,
  WalletsModal,
  useBalance
} from 'wallets-connector'

import { transitions } from '../styles'

import Banner from './Banner'

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
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

interface IHeaderStyle {
  connected: boolean
}

const SAddress = styled.div<IHeaderStyle>`
  transition: ${transitions.base};
  font-weight: bold;
  margin: ${({ connected }) => (connected ? '-2px auto 0.7em' : '0')};
`

const SDisconnect = styled.div<IHeaderStyle>`
  transition: ${transitions.button};
  font-size: 12px;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  opacity: ${({ connected }) => (connected ? 1 : 0)};
  visibility: ${({ connected }) => (connected ? 'visible' : 'hidden')};
  pointer-events: ${({ connected }) => (connected ? 'auto' : 'none')};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
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

  const { wallet } = useWalletsConnector()
  const accounts = useConnectedAccounts()

  const connected = !!wallet

  const ethBalance = useBalance(IChainType.ethereum)

  return (
    <SHeader>
      {wallet ? (
        <SActiveChain>Connected {ethBalance.toString()} ETH</SActiveChain>
      ) : (
        <Banner />
      )}
      <SAddress connected={connected}>
        {connected ? (
          <Fragment>
            {wallet && wallet.chains ? (
              <RenderChains accounts={accounts} />
            ) : (
              'Ethereum'
            )}
          </Fragment>
        ) : (
          <WalletsModal
            trigger={(props: any) => <BtnOpen {...props}>Connect</BtnOpen>}
          />
        )}{' '}
      </SAddress>
      <SActiveAccount>
        <SDisconnect connected={connected} onClick={killSession}>
          {'Disconnect'}
        </SDisconnect>
      </SActiveAccount>
    </SHeader>
  )
}

const RenderChains = ({ accounts }: { accounts: IChainWithAccount }) => {
  return (
    <Fragment>
      {Object.keys(accounts).map((chain: string) => (
        <div key={chain}>
          {chain}: {accounts[chain]}
        </div>
      ))}
    </Fragment>
  )
}

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
}

export default Header
