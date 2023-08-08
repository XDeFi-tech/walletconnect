import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import styled from 'styled-components'
import { CHAIN_OPTIONS, CHAIN_VALUES } from './SelectChainSection.constants'
import { ChainCard } from '../ChainCard'
import { PrimaryButton } from '../../PrimaryButton'
import { canInject, IProviderUserOptions } from 'src/helpers'
import { useConnectorActiveIds, useConnectorMultiChains } from 'src/hooks'
import { WalletsContext } from 'src/manager'

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
  const [selectedChains, setSelectedChain] = useState<string[]>(CHAIN_VALUES)

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
          context.disconnect(provider?.id)
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
      <ChainContainer>
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
const ChainContainer = styled.div`
  gap: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;

  ${({ theme }) => theme.mediaWidth.upToTablet`
    padding: 0px;
  `};
`

const DescriptionWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.selectChain.description};
`

const DescTitle = styled.div`
  font-weight: 900;
  font-size: 13px;
  color: white;
`

const DescText = styled.div`
  margin-top: 2px;
  font-weight: 500;
`
