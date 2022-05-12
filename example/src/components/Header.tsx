import React, { Fragment } from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import {
  IChainWithAccount,
  useConnectedAccounts,
  useWalletsConnector
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
  font-family: monospace;
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

interface IHeaderProps {
  killSession: () => void
}

const Header = (props: IHeaderProps) => {
  const { killSession } = props

  const { provider } = useWalletsConnector()
  const accounts = useConnectedAccounts()

  const connected = !!provider

  return (
    <SHeader>
      {provider ? <SActiveChain>Connected</SActiveChain> : <Banner />}
      <SAddress connected={connected}>
        {connected ? (
          <Fragment>
            {provider && provider.chains ? (
              <RenderChains accounts={accounts} />
            ) : (
              'Ethereum'
            )}
          </Fragment>
        ) : (
          'Not Connected'
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
  console.log('accounts', accounts)
  return (
    <Fragment>
      {Object.keys(accounts).map((chain: string) => (
        <div key={chain}>
          {chain}: {accounts[chain].join(',')}
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
