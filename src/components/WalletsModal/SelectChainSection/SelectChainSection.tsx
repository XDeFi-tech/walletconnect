import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { useMediaQuery } from 'src/hooks/utils'
import { CHAIN_OPTIONS, CHAIN_VALUES } from './SelectChainSection.constants'
import { ChainCard } from '../ChainCard'
import { PrimaryButton } from '../../PrimaryButton'

interface IProps {
  className?: string
}

export const SelectChainSection = ({ className }: IProps) => {
  const isTablet = useMediaQuery('(max-width: 768px)')
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
              checked={Boolean(
                selectedChains.find((chainName) => chain.value === chainName)
              )}
              onClick={handleClick}
            />
          ))}
        </ChainContainer>
      ) : (
        <React.Fragment>
          <ChainContainer padding='0 30px'>
            {CHAIN_OPTIONS.slice(0, 5).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={Boolean(
                  selectedChains.find((chainName) => chain.value === chainName)
                )}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
          <ChainContainer padding='0 40px'>
            {CHAIN_OPTIONS.slice(5, 10).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={Boolean(
                  selectedChains.find((chainName) => chain.value === chainName)
                )}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
          <ChainContainer padding='0 90px'>
            {CHAIN_OPTIONS.slice(10).map((chain) => (
              <ChainCard
                key={chain.value}
                icon={chain.icon}
                label={chain.label}
                value={chain.value}
                checked={Boolean(
                  selectedChains.find((chainName) => chain.value === chainName)
                )}
                onClick={handleClick}
              />
            ))}
          </ChainContainer>
        </React.Fragment>
      )}
      <DeselectAllWrapper onClick={handleDeselectAllChain}>
        Deselect All
      </DeselectAllWrapper>
      <ButtonWrapper>
        <PrimaryButton
          label='Connect wallet'
          fullWidth
          disabled={!selectedChains.length}
          loading={false}
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
  color: #ffffff;
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
  color: #9ecaff;
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
  color: #969da3;
`

const DescTitle = styled.div`
  font-weight: 700;
`

const DescText = styled.div`
  margin-top: 2px;
  font-weight: 500;
`
