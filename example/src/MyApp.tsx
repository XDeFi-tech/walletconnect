import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import {
  IChainType,
  IChainWithAccount,
  useConnectedAccounts,
  useSign,
  useSignAvailability,
  WalletsContext
} from '@xdefi/wallets-connector'

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

const MyApp = () => {
  const context = useContext(WalletsContext)

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

    await context.connector.connect()
  }

  const resetApp = async () => {
    if (context) {
      await context.disconnect()
    }
  }

  const accounts = useConnectedAccounts()

  return (
    <SLayout>
      <Column maxWidth={1000} spanHeight>
        <Header killSession={resetApp} />
        <SContent>
          {Object.keys(accounts).map((chain: string) => {
            return <Sign key={chain} chain={chain} accounts={accounts} />
          })}
        </SContent>
      </Column>
    </SLayout>
  )
}

const Sign = ({
  chain,
  accounts
}: {
  chain: string
  accounts: IChainWithAccount
}) => {
  const isAvailable = useSignAvailability(chain as IChainType)

  const providerSign = useSign()

  const sign = async (chain: IChainType) => {
    // test message
    const message = 'My email is john@doe.com - 1537836206101'

    // hash message
    const hash = hashPersonalMessage(message)
    const result = await providerSign(chain, hash)

    alert(result)
  }

  return (
    <SBalances>
      <h3>
        {chain} with account {accounts[chain]}
      </h3>
      <Column center>
        <STestButtonContainer>
          <STestButton
            disabled={!isAvailable}
            left
            onClick={() => sign(chain as IChainType)}
          >
            {SIGN}
          </STestButton>
        </STestButtonContainer>
      </Column>
    </SBalances>
  )
}

export default MyApp
