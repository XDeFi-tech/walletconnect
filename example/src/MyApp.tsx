import { useState, useContext, useEffect } from 'react'
import styled from 'styled-components'
import {
  IChainType,
  useConnectedAccounts,
  WalletsContext
} from 'wallets-connector'

import Button from './components/Button'
import Column from './components/Column'
import Wrapper from './components/Wrapper'
import Header from './components/Header'
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
  provider: null
}

const MyApp = () => {
  const context = useContext(WalletsContext)

  const [state, setState] = useState<IAppState>(INITIAL_STATE)

  useEffect(() => {
    if (context && context.connector.cachedProvider) {
      onConnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  const onConnect = async () => {
    if (!context) {
      return
    }

    const provider = await context.connector.connect()

    await provider.enable()

    setState({
      ...state,
      provider
    })
  }

  const resetApp = async () => {
    if (context) {
      await context.disconnect()
      setState(INITIAL_STATE)
    }
  }

  const accounts = useConnectedAccounts()

  const sign = async (chain: IChainType) => {
    if (!context) {
      return
    }
    // test message
    const message = 'My email is john@doe.com - 1537836206101'

    // hash message
    const hash = hashPersonalMessage(message)
    const result = await context.signMessage(chain, hash)

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
        </SContent>
      </Column>
    </SLayout>
  )
}

export default MyApp
