import { useContext, useMemo } from 'react'
import styled from 'styled-components'

import { NetworkContext } from '../NetworkManager'

import { Provider } from './Provider'

declare global {
  interface Window {
    // @ts-ignore
    ethereum: any
    BinanceChain: any
    web3: any
    celo: any
    updateWeb3Modal: any
  }
}

interface IModalCardStyleProps {
  maxWidth?: number
}

const SModalCard = styled.div<IModalCardStyleProps>`
  position: relative;
  width: 100%;
  border-radius: 12px;
  margin: 10px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '800px')};
  min-width: fit-content;
  max-height: 100%;
  overflow: auto;

  @media screen and (max-width: 768px) {
    max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : '500px')};
    grid-template-columns: 1fr;
  }
`

export const Wallets = () => {
  const context = useContext(NetworkContext)

  const userOptions = useMemo(() => {
    return context.connector.getUserOptions()
  }, [context])

  console.log('userOptions', userOptions)

  return (
    <SModalCard maxWidth={userOptions.length < 3 ? 500 : 800}>
      {userOptions.map((provider: any) =>
        !!provider ? (
          <Provider
            name={provider.name}
            logo={provider.logo}
            description={provider.description}
            onClick={provider.onClick}
          />
        ) : null
      )}
    </SModalCard>
  )
}
