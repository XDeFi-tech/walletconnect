import * as React from 'react'
import styled from 'styled-components'
import Web3 from 'web3'

import { NetworkContext } from '../NetworkManager'

import Button from './components/Button'
import Column from './components/Column'
import Wrapper from './components/Wrapper'
import Header from './components/Header'
import Loader from './components/Loader'
import ModalResult from './components/ModalResult'
import ConnectButton from './components/ConnectButton'
import { IAssetData } from './helpers/types'
import { fonts } from './styles'
import { ETH_SEND_TRANSACTION, ETH_SIGN, PERSONAL_SIGN } from './constants'
import { SupportedChainId } from '../helpers'

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

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`

const SLanding = styled(Column)`
  height: 600px;
`

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`

const SModalParagraph = styled.p`
  margin-top: 30px;
`

// @ts-ignore
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
  fetching: boolean
  provider: any
  connected: boolean
  pendingRequest: boolean
  result: any | null
}

const INITIAL_STATE: IAppState = {
  fetching: false,
  address: '',
  provider: null,
  connected: false,
  pendingRequest: false,
  result: null,
}

const MyApp = () => {
  const context = React.useContext(NetworkContext)

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

    await subscribeProvider(provider)

    await provider.enable()

    setState({
      ...state,
      provider,
      connected: true,
    })
  }

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return
    }

    provider.on('close', () => resetApp())
    provider.on('accountsChanged', async (accounts: string[]) => {
      await setState({
        ...state,
        address: accounts[0],
      })
    })
    provider.on('chainChanged', async (chainId: number) => {
      const { web3 } = state
      const networkId = await web3.eth.net.getId()
      await setState({
        ...state,
        chainId,
        networkId,
      })
    })

    provider.on('networkChanged', async (networkId: number) => {
      const { web3 } = state
      const chainId = await web3.eth.chainId()
      await setState({
        ...state,
        chainId,
        networkId,
      })
    })
  }

  const resetApp = async () => {
    await context.connector.clearCachedProvider()
    setState(INITIAL_STATE)
  }

  const { connected, fetching, pendingRequest, result } = state

  const { testSendTransaction, testSignMessage, testSignPersonalMessage } =
    context

  return (
    <SLayout>
      <Column maxWidth={1000} spanHeight>
        <Header connected={connected} killSession={resetApp} />
        <SContent>
          {fetching ? (
            <Column center>
              <SContainer>
                <Loader />
              </SContainer>
            </Column>
          ) : (
            <SBalances>
              <h3>Actions</h3>
              <Column center>
                <STestButtonContainer>
                  <STestButton
                    left
                    onClick={() =>
                      testSendTransaction(SupportedChainId.MAINNET)
                    }
                  >
                    {ETH_SEND_TRANSACTION}
                  </STestButton>

                  <STestButton
                    left
                    onClick={() => testSignMessage(SupportedChainId.MAINNET)}
                  >
                    {ETH_SIGN}
                  </STestButton>

                  <STestButton
                    left
                    onClick={() =>
                      testSignPersonalMessage(SupportedChainId.MAINNET)
                    }
                  >
                    {PERSONAL_SIGN}
                  </STestButton>
                </STestButtonContainer>
              </Column>
            </SBalances>
          )}

          <SLanding center>
            <h3>{`Test Connect`}</h3>
            <ConnectButton onClick={onConnect} />
          </SLanding>
        </SContent>
      </Column>

      {pendingRequest ? (
        <SModalContainer>
          <SModalTitle>{'Pending Call Request'}</SModalTitle>
          <SContainer>
            <Loader />
            <SModalParagraph>
              {'Approve or reject request using your wallet'}
            </SModalParagraph>
          </SContainer>
        </SModalContainer>
      ) : result ? (
        <SModalContainer>
          <SModalTitle>{'Call Request Approved'}</SModalTitle>
          <ModalResult>{result}</ModalResult>
        </SModalContainer>
      ) : (
        <SModalContainer>
          <SModalTitle>{'Call Request Rejected'}</SModalTitle>
        </SModalContainer>
      )}
    </SLayout>
  )
}

export default MyApp
