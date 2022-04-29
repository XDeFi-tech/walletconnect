import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'

import { WalletsContext } from '../../WalletsManager'
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

const SAddress = styled.p<IHeaderStyle>`
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
  const context = React.useContext(WalletsContext)

  const current = context.connector.injectedProvider
  const connected = !!current

  return (
    <SHeader>
      {current ? <SActiveChain>Connected</SActiveChain> : <Banner />}
      <SAddress connected={connected}>
        {connected ? (
          <>
            {current.chains ? (
              <RenderChains chains={current.chains} />
            ) : (
              'Ethereum'
            )}
          </>
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

const RenderChains = ({ chains }: { chains: any }) => {
  return (
    <>
      {Object.keys(chains).map((c) => (
        <div key={c}>{c}</div>
      ))}
    </>
  )
}

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string,
}

export default Header
