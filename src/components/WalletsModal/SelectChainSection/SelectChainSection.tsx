import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import styled, { css } from 'styled-components'

import { useMediaQuery } from 'src/hooks/utils'
import { CHAIN_OPTIONS, CHAIN_VALUES } from './SelectChainSection.constants'
import { ChainCard } from '../ChainCard'
import { PrimaryButton } from '../../PrimaryButton'
import { canInject, IProviderUserOptions } from 'src/helpers'
import { useConnectorActiveIds, useConnectorMultiChains } from 'src/hooks'
import { WalletsContext } from 'src/manager'
import { IChainType } from 'src/constants'

interface IProps {
  className?: string
  provider?: IProviderUserOptions | null
  onSelect: () => void
}

export const SelectChainSection = ({
  className,
  provider,
  onSelect
}: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)')
  const [selectedChains, setSelectedChain] = useState<string[]>(
    CHAIN_VALUES.filter((x) => x !== IChainType.bitcoin)
  )

  const handleClick = (value: string) => {
    const isExist = selectedChains.find((chainName) => chainName === value)

    if (isExist) {
      setSelectedChain((state) =>
        state.filter((chainName) => chainName !== value)
      )
    } else {
      setSelectedChain((state) => [...state, value])
    }
  }

  const handleDeselectAllChain = () => {
    setSelectedChain([])
  }

  const pids = useConnectorActiveIds()
  const context = useContext(WalletsContext)

  const needInstall = useMemo(() => {
    return (
      (provider?.installationLink && !canInject()) ||
      (provider && !context?.isAvailableProvider(provider?.id))
    )
  }, [provider, context])

  const disabledByWallet = useMemo(
    () => context && provider && context.disabledByProvider(provider?.id),
    [context, provider]
  )

  const [loading, setLoading] = useState(false)
  const isActive = useMemo(() => {
    return pids.some((i) => i === provider?.id)
  }, [provider, pids])

  const isAvailable = !disabledByWallet && !needInstall

  const { injectedChains: injectedChainsPerProvider } =
    useConnectorMultiChains()

  const providerInjectedChains = useMemo(() => {
    return injectedChainsPerProvider && provider
      ? injectedChainsPerProvider[provider.id] || []
      : []
  }, [injectedChainsPerProvider, provider])

  const handleConnectToProvider = useCallback(async () => {
    try {
      if (isAvailable && context && !needInstall && provider) {
        setLoading(true)
        if (isActive) {
          if (context.connector.isSingleProviderEnabled) {
            context.disconnect()
          } else {
            context.disconnect(provider?.id)
          }
        }
        await context.connector.connectTo(provider?.id, [
          ...providerInjectedChains,
          ...selectedChains
        ])
        onSelect()
      }
    } catch (e) {
      setLoading(false)
      throw new Error(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [
    isAvailable,
    context,
    needInstall,
    onSelect,
    isActive,
    provider,
    providerInjectedChains,
    selectedChains
  ])

  useEffect(() => {
    if (isActive && !isAvailable && context) {
      context?.disconnect()
    }
  }, [context, isActive, isAvailable])

  const isChecked = useCallback(
    (chain) =>
      Boolean(selectedChains.some((chainName) => chain.value === chainName)),
    [selectedChains]
  )

  const isDisabled = useCallback(
    (chain) => {
      if (chain.value === IChainType.bitcoin) {
        // TODO Remove when fixed
        return true
      }
      return Boolean(
        providerInjectedChains &&
          providerInjectedChains.some((chainName) => chain.value === chainName)
      )
    },
    [providerInjectedChains]
  )

  useEffect(() => {
    if (providerInjectedChains) {
      setSelectedChain((prev) => {
        return prev.filter(
          (item) =>
            !providerInjectedChains.some((chainName) => item === chainName)
        )
      })
    }
  }, [providerInjectedChains])

  return (
    <Container className={className}>
      <Title>Select chains</Title>
      {isTablet ? (
        <ChainContainer padding='0'>
          {CHAIN_OPTIONS.map((chain) => (
            <ChainCard
              key={chain.value}
              icon={chain.icon}
              label={chain.label}
              value={chain.value}
              checked={isChecked(chain)}
              disabled={isDisabled(chain)}
              onClick={handleClick}
            />
          ))}
        </ChainContainer>
      ) : (
        <React.Fragment>
          <ChainContainer padding='0 30px'>
            {CHAIN_OPTIONS.slice(0, 4).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={isChecked(chain)}
                disabled={isDisabled(chain)}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
          <ChainContainer padding='0 30px'>
            {CHAIN_OPTIONS.slice(4, 8).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={isChecked(chain)}
                disabled={isDisabled(chain)}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
          <ChainContainer padding='0 30px'>
            {CHAIN_OPTIONS.slice(8, 12).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={isChecked(chain)}
                disabled={isDisabled(chain)}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
          <ChainContainer padding='0 90px'>
            {CHAIN_OPTIONS.slice(12).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={isChecked(chain)}
                disabled={isDisabled(chain)}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
        </React.Fragment>
      )}
      {selectedChains.length > 0 && (
        <DeselectAllWrapper onClick={handleDeselectAllChain}>
          Deselect All
        </DeselectAllWrapper>
      )}
      <ButtonWrapper>
        <PrimaryButton
          label='Connect wallet'
          fullWidth
          disabled={!selectedChains.length || loading}
          loading={loading}
          onClick={handleConnectToProvider}
        />
      </ButtonWrapper>
      <DescriptionWrapper>
        <DescTitle>For XDEFI hardware wallet users</DescTitle>
        <DescText>
          When connecting a hardware wallet, please only select your hardware
          wallet’s relevant network.
        </DescText>
      </DescriptionWrapper>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 16px;
  width: 100%;
`
const Title = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${({ theme }) => theme.selectChain.title};
`

const ChainContainer = styled.div<{ padding?: string }>`
  display: flex;
  grid-gap: 40px;
  margin-top: 24px;

  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-wrap: wrap;
    grid-gap: unset;
  `}
`

const DeselectAllWrapper = styled.div`
  width: 100%;
  margin-top: 16px;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  text-align: right;
  color: ${({ theme }) => theme.selectChain.deselectAll};
  cursor: pointer;
`
const ButtonWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
`

const DescriptionWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.selectChain.description};
`

const DescTitle = styled.div`
  font-weight: 700;
`

const DescText = styled.div`
  margin-top: 2px;
  font-weight: 500;
`
