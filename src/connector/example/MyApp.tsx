import * as React from 'react'
import styled from 'styled-components'

import { WalletsContext } from '../WalletsManager'
import { IChainType } from '../helpers'

import Button from './components/Button'
import Column from './components/Column'
import Wrapper from './components/Wrapper'
import Header from './components/Header'
import ConnectButton from './components/ConnectButton'
import { fonts } from './styles'
import { SIGN } from './constants'
import { hashPersonalMessage } from './helpers/utilities'

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`

const SLanding = styled(Column)``

const SBalances = styled(SLanding)`
  height: 100%;

  & h3 {
    padding-top: 30px;
  }
`

const STestButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`

const STestButton = styled(Button)`
  border-radius: 8px;
  font-size: ${fonts.size.medium};
  height: 44px;
  width: 100%;
  max-width: 175px;
  margin: 12px;
`

interface IAppState {
  provider: any
}

const INITIAL_STATE: IAppState = {
  provider: null,
}

const MyApp = () => {
  const context = React.useContext(WalletsContext)

  const [state, setState] = React.useState<IAppState>(INITIAL_STATE)

  React.useEffect(() => {
    if (context && context.connector.cachedProvider) {
      onConnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  const onConnect = async () => {
    if (!context) {
      return null
    }

    const provider = await context.connector.connect()

    await provider.enable()

    setState({
      ...state,
      provider,
    })
  }

  const resetApp = async () => {
    await context.connector.clearCachedProvider()
    setState(INITIAL_STATE)
  }

  const { signMessage } = context

  const accounts = context.getAccounts()

  const sign = async (chain: IChainType) => {
    // test message
    const message = 'My email is john@doe.com - 1537836206101'

    // hash message
    const hash = hashPersonalMessage(message)
    const result = await signMessage(chain, hash)

    alert(result)
  }

  return (
    <SLayout>
      <Column maxWidth={1000} spanHeight>
        <Header killSession={resetApp} />
        <SContent>
          {Object.keys(accounts).map((chain: string) => {
            return (
              <SBalances key={chain}>
                <h3>
                  {chain} with account {accounts[chain][0]}
                </h3>
                <Column center>
                  <STestButtonContainer>
                    <STestButton left onClick={() => sign(chain as IChainType)}>
                      {SIGN}
                    </STestButton>
                  </STestButtonContainer>
                </Column>
              </SBalances>
            )
          })}

          <SLanding center>
            <h3>{`Test Connect`}</h3>
            <ConnectButton onClick={onConnect} />
          </SLanding>
        </SContent>
      </Column>
    </SLayout>
  )
}

export default MyApp
