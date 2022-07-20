import React from 'react'

import styled from 'styled-components'
import Column from 'src/components/Column'

export const SLanding = styled(Column)``

export const SChain = styled.div`
  font-size: 24px;
  padding-bottom: 12px;
  color: red;
`

export const SAccounts = styled.div`
  font-size: 18px;
`

export const SList = styled.div`
  color: green;
`

export const SBalances = styled(SLanding)`
  width: 100%;
  display: flex;
  border-radius: 16px;
  width: 100%;
  border: 1px solid black;
  padding: 12px;

  & h3 {
    padding-top: 30px;
  }
`

const AccountsBlock = ({
  chain,
  accounts
}: {
  chain: string
  accounts: string[]
}) => {
  return (
    <SBalances>
      <SChain>{chain}</SChain>
      <SAccounts>
        with accounts{' '}
        <SList>{accounts ? accounts.join(', ') : '<not set>'}</SList>
      </SAccounts>
    </SBalances>
  )
}

export default AccountsBlock
