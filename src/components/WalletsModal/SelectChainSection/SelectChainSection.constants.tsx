import React from 'react'
import { IChainType } from '../../../constants/enums'

import { ReactComponent as Arbitrum } from '../../icons/Arbitrum.svg'
import { ReactComponent as Avalanche } from '../../icons/Avalanche.svg'
import { ReactComponent as BinanceSmartChain } from '../../icons/BinanceSmartChain.svg'
import { ReactComponent as Bitcoin } from '../../icons/Bitcoin.svg'
import { ReactComponent as Bitcoincash } from '../../icons/Bitcoincash.svg'
import { ReactComponent as Doge } from '../../icons/DOGE.svg'
import { ReactComponent as Solana } from '../../icons/solana.svg'
import { ReactComponent as Ethereum } from '../../icons/Ethereum.svg'
import { ReactComponent as Fantom } from '../../icons/Fantom.svg'
import { ReactComponent as Litecoin } from '../../icons/Litecoin.svg'
import { ReactComponent as Polygon } from '../../icons/Polygon.svg'
import { ReactComponent as Thor } from '../../icons/Thor.svg'
import { ReactComponent as Osmosis } from '../../icons/Osmosis.svg'
import { ReactComponent as Cosmos } from '../../icons/Cosmos.svg'
import { ReactComponent as Axelar } from '../../icons/Axelar.svg'
import { ReactComponent as Stargaze } from '../../icons/Stargaze.svg'
import { ReactComponent as Kujira } from '../../icons/Kujira.svg'
import { ReactComponent as Optimism } from '../../icons/Optimism.svg'
// import { ReactComponent as Near } from '../../icons/Near.svg'
// import { ReactComponent as Kava } from '../../icons/Kava.svg'
// import { ReactComponent as Akash } from '../../icons/Akash.svg'
// import { ReactComponent as Cronos } from '../../icons/Cronos.svg'
// import { ReactComponent as Stride } from '../../icons/Stride.svg'
// import { ReactComponent as Mars } from '../../icons/Mars.svg'

export const CHAIN_OPTIONS = [
  {
    icon: <Bitcoin />,
    value: IChainType.bitcoin,
    label: 'Bitcoin'
  },
  {
    icon: <Ethereum />,
    value: IChainType.ethereum,
    label: 'Ethereum'
  },
  {
    icon: <Polygon />,
    value: IChainType.polygon,
    label: 'Polygon'
  },
  {
    icon: <Avalanche />,
    value: IChainType.avalanche,
    label: 'Avalanche '
  },
  {
    icon: <Fantom />,
    value: IChainType.fantom,
    label: 'Fantom'
  },
  {
    icon: <Arbitrum />,
    value: IChainType.arbitrum,
    label: 'Arbitrum'
  },
  {
    icon: <Optimism />,
    value: IChainType.optimism,
    label: 'Optimism'
  },
  {
    icon: <BinanceSmartChain />,
    value: IChainType.binancesmartchain,
    label: 'BSC'
  },
  {
    icon: <Thor />,
    value: IChainType.thorchain,
    label: 'THORChain'
  },
  {
    icon: <Litecoin />,
    value: IChainType.litecoin,
    label: 'Litecoin'
  },
  {
    icon: <Bitcoincash />,
    value: IChainType.bitcoincash,
    label: 'BCH'
  },
  {
    icon: <Doge />,
    value: IChainType.dogecoin,
    label: 'Dogecoin'
  },
  {
    icon: <Solana />,
    value: IChainType.solana,
    label: 'Solana'
  },
  {
    icon: <Cosmos />,
    value: IChainType.cosmos,
    label: 'Cosmos'
  },
  {
    icon: <Osmosis />,
    value: IChainType.osmosis,
    label: 'Osmosis'
  },
  {
    icon: <Axelar />,
    value: IChainType.axelar,
    label: 'Axelar'
  },
  {
    icon: <Stargaze />,
    value: IChainType.stargaze,
    label: 'Stargaze'
  },
  {
    icon: <Kujira />,
    value: IChainType.kujira,
    label: 'Kujira'
  }
  // {
  //   icon: <Near />,
  //   value: 'near',
  //   label: 'NEAR'
  // },
  // {
  //   icon: <Kava />,
  //   value: IChainType.kava,
  //   label: 'Kava'
  // },
  // {
  //   icon: <Akash />,
  //   value: IChainType.akash,
  //   label: 'Akash'
  // },
  // {
  //   icon: <Cronos />,
  //   value: IChainType.cronos,
  //   label: 'Crypto.Org'
  // },
  // {
  //   icon: <Stride />,
  //   value: IChainType.stride,
  //   label: 'Stride'
  // },
  // {
  //   icon: <Mars />,
  //   value: IChainType.mars,
  //   label: 'Mars'
  // }
]

export const CHAIN_VALUES = CHAIN_OPTIONS.map(
  (item) => item.value
) as IChainType[]
