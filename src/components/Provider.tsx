import * as React from 'react'
import styled from 'styled-components'

import { IProviderInfo, IProviderUserOptions } from '../helpers'
import { WALLETS_EVENTS } from '../WalletsConnector'
import { WalletsContext } from '../NetworkManager'

const SIcon = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  border-radius: 50%;
  overflow: visible;
  box-shadow: none;
  justify-content: center;
  align-items: center;
  & img {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 768px) {
    width: 8.5vw;
    height: 8.5vw;
  }
`

const SName = styled.div`
  width: 100%;
  font-size: 24px;
  font-weight: 700;
  margin-top: 0.5em;
  @media screen and (max-width: 768px) {
    font-size: 5vw;
  }
`

const SDescription = styled.div`
  width: 100%;
  font-size: 18px;
  margin: 0.333em 0;
  @media screen and (max-width: 768px) {
    font-size: 4vw;
  }
`

const SProviderContainer = styled.div`
  transition: background-color 0.2s ease-in-out;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 24px 16px;
  @media screen and (max-width: 768px) {
    padding: 1vw;
  }
`

const SProviderWrapper = styled.div<{ connected: boolean }>`
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  border-radius: 16px;
  border: ${({ connected }) => (connected ? '1px solid green' : 'none')};

  &:hover {
    border: 1px solid blue;
  }
`

const SButton = styled.button`
  margin-top: 24px;
`

const STitle = styled.div`
  margin: 16px 0;
`

interface IProviderProps {
  provider: IProviderUserOptions
}

export function Provider(props: IProviderProps) {
  const { provider } = props

  const { name, logo, description, onClick, chains } = provider
  const { ...otherProps } = props

  const context = React.useContext(WalletsContext)

  const [current, setCurrentProvider] = React.useState<IProviderInfo | null>(
    null
  )
  const [injectedChains, setInjectedChains] = React.useState<string[]>([])

  React.useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.CURRENT_WALLET, (provider: IProviderInfo) => {
        setCurrentProvider(provider)
      })

      context.on(WALLETS_EVENTS.CONNECTED_CHAINS, (newList: string[]) => {
        setInjectedChains(newList)
      })
    }
  }, [context])

  const [selectedChains, setChains] = React.useState<any>({})

  const supportedChains = React.useMemo(() => {
    return chains ? Object.keys(chains) : []
  }, [chains])

  const toggleChain = (chain: string) => {
    const newChains = { ...selectedChains }

    if (newChains[chain]) {
      delete newChains[chain]
    } else {
      newChains[chain] = true
    }

    setChains(newChains)
  }

  return (
    <SProviderWrapper {...otherProps} connected={name === current?.name}>
      <SProviderContainer>
        <SIcon>
          <img src={logo} alt={name} />
        </SIcon>
        <SName>{name}</SName>
        <SDescription>{description}</SDescription>

        {chains ? 'Cross chain' : 'Only etherum'}

        <>
          <>
            {supportedChains.length ? (
              <>
                <STitle>Select chain:</STitle>

                {supportedChains.map((i) => {
                  const isInjected =
                    name === current?.name && injectedChains.indexOf(i) !== -1

                  return (
                    <SButton
                      key={i}
                      disabled={isInjected}
                      onClick={() => toggleChain(i)}
                    >
                      {selectedChains[i] ? 'Delete' : 'Add'} {i}
                    </SButton>
                  )
                })}
              </>
            ) : null}
          </>
        </>

        <SButton onClick={() => onClick(Object.keys(selectedChains))}>
          Connect
        </SButton>
      </SProviderContainer>
    </SProviderWrapper>
  )
}
