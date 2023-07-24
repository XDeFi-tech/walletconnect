import React from 'react'

import styled from 'styled-components'
import Column from 'src/components/Column'

export const SChain = styled.div`
  font-size: 24px;
  padding-bottom: 12px;
  color: red;
`

export const SAccounts = styled.div`
  font-size: 18px;
`

export const SList = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 1;
  color: green;
`

export const SBalances = styled(Column)`
  display: flex;
  border-radius: 16px;
  border: 1px solid black;
  padding: 12px;
  overflow: hidden;

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
        <SList>
          {accounts && Array.isArray(accounts)
            ? accounts.join(', ')
            : '<not set>'}
        </SList>
      </SAccounts>
    </SBalances>
  )
}

export default AccountsBlock
