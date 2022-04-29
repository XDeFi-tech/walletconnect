import { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { WalletsContext } from '../WalletsManager'

import { Provider } from './Provider'

interface IModalCardStyleProps {
  maxWidth?: number
}

const SCard = styled.div<IModalCardStyleProps>`
  position: relative;
  width: 100%;
  border-radius: 12px;
  margin: 10px;
  padding: 0;
  display: flex;
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;
`

export const Wallets = () => {
  const context = useContext(WalletsContext)

  const userOptions = useMemo(() => {
    return context.connector.getUserOptions()
  }, [context])

  return (
    <SCard>
      {userOptions.map((provider: any) =>
        !!provider ? <Provider key={provider.name} provider={provider} /> : null
      )}
    </SCard>
  )
}
