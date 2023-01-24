import React from 'react'
import { IChainType } from '../../../constants/enums'

import { ReactComponent as Arbitrum } from '../../icons/Arbitrum.svg'
import { ReactComponent as Aurora } from '../../icons/Aurora.svg'
import { ReactComponent as Avalanche } from '../../icons/Avalanche.svg'
import { ReactComponent as BinanceSmartChain } from '../../icons/BinanceSmartChain.svg'
import { ReactComponent as Bitcoin } from '../../icons/Bitcoin.svg'
import { ReactComponent as Bitcoincash } from '../../icons/Bitcoincash.svg'
import { ReactComponent as Doge } from '../../icons/DOGE.svg'
import { ReactComponent as Ethereum } from '../../icons/Ethereum.svg'
import { ReactComponent as Fantom } from '../../icons/Fantom.svg'
import { ReactComponent as Litecoin } from '../../icons/Litecoin.svg'
import { ReactComponent as Near } from '../../icons/Near.svg'
import { ReactComponent as Polygon } from '../../icons/Polygon.svg'
import { ReactComponent as Thor } from '../../icons/Thor.svg'

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
    icon: <Aurora />,
    value: 'aurora',
    label: 'Aurora'
  },
  {
    icon: <BinanceSmartChain />,
    value: IChainType.binancesmartchain,
    label: 'BSC'
  },
  {
    icon: <Thor />,
    value: IChainType.thorchain,
    label: 'Thorchain'
  },
  {
    icon: <Near />,
    value: 'near',
    label: 'NEAR'
  },
  {
    icon: <Litecoin />,
    value: IChainType.litecoin,
    label: 'Litecoin'
  },
  {
    icon: <Bitcoincash />,
    value: IChainType.bitcoincash,
    label: 'Bitcoin Cash'
  },
  {
    icon: <Doge />,
    value: IChainType.dogecoin,
    label: 'Dogecoin'
  }
]

export const CHAIN_VALUES = CHAIN_OPTIONS.map((item) => item.value)
