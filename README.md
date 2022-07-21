# @xdefi/wallets-connector

Example: https://xdefi-tech.github.io/walletconnect/

Please, look at the example application in folder `example`

![UI](./example/wallets-example-dark.png)
![UI](./example/wallets-example-light.png)

## Install

```bash
yarn add @xdefi/wallets-connector
```

## Introduction

@xdefi/wallets-connector is an easy-to-use library to help developers add support for multiple providers in their apps with a simple customizable configuration.

By default Library supports injected providers like ( **Metamask**,**Brave Wallet**, **Dapper**, **Frame**, **Gnosis Safe**, **Tally**, Web3 Browsers, etc) and **WalletConnect**. You can also easily configure the library to support **Coinbase Wallet**, **Torus**, **Portis**, **Fortmatic** and many more.

## Usage/Custom Display

It's possible to customize the display of each provider to change the name, description and logo. These options are available as part of the provider options as following

```tsx
const getProviderOptions = (): IProviderOptions => {
  const infuraId = 'your_infura_key'
  const providerOptions = {
    xdefi: {
      package: true,
      connector: connectors.injected,
      display: injected.XDEFI
    },
    injected: {
      package: true,
      connector: connectors.injected,
      display: injected.FALLBACK
    },
    metamask: {
      package: true,
      connector: connectors.injected,
      display: injected.METAMASK
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Coinbase App',
        infuraId
      }
    },
    torus: {
      package: Torus
    }
  }
  return providerOptions
}

function App() {
  const [options] = useState(() => getProviderOptions())
  return (
    <NetworkManager options={options}>
      <MyApp />
    </NetworkManager>
  )
}
```

## Using with [ethers.js](https://github.com/ethers-io/ethers.js/)

```js
import { ethers } from "ethers";

...

const { provider } = useConnectorSingleProvider();

const walletRequest = useWalletRequest();

const signTransaction = useCallback(
  async (transaction: RouteTransactionType) => {
    const { chain, unsignedStdTx } = transaction;
    const unSignedTx =
      typeof unsignedStdTx === 'string'
        ? JSON.parse(unsignedStdTx)
        : unsignedStdTx;

    if (
      [
        IChainType.bitcoin,
        IChainType.litecoin,
        IChainType.bitcoincash,
        IChainType.dogecoin,
      ].includes(mapChainNameToIChain[chain])
    ) {
      const result = await walletRequest({
        chainId: mapChainNameToIChain[chain],
        method: 'transfer',
        params: [
          YOUR_TX_PARAMS,
        ],
      });

      return result;
    } else if (mapChainNameToIChain[chain] === IChainType.thorchain) {
      // const asset = assetFromDenom(
      //   unSignedTx.msg[0].value.coins[0].asset || ''
      // );
      const { asset } = unSignedTx.msg[0].value.coins[0];
      const payloadAsset = {
        chain: transaction.chain,
        symbol: asset.includes('.') ? asset.split('.')[1] : asset,
        ticker: asset.includes('.') ? asset.split('.')[1] : asset,
      };
      const result = await walletRequest({
        chainId: mapChainNameToIChain[chain],
        method: 'deposit',
        params: [
          YOUR_TX_PARAMS,
        ],
      });
      return result;
    } else if (mapChainNameToIChain[chain] === IChainType.binance) {
      const result = await walletRequest({
        chainId: mapChainNameToIChain[chain],
        method: 'transfer',
        params: [
          YOUR_TX_PARAMS,
        ],
      });
      return result;
    } else {
      throw new Error(`${chain} is not yet supported 🥺`);
    }
  },
  [walletRequest]
);

const web3Provider = useMemo(() => {
  if (provider) {
    const web3 = new ethers.providers.Web3Provider(provider);
    return web3;
  }
  return null;
}, [provider]);

const etherSigner = useMemo(() => {
  if (!web3Provider) return null;
  return web3Provider.getSigner();
}, [web3Provider]);

```

## Using with [Vite](https://github.com/vitejs/vite)

```js
//vite.config.js
import nodePolyfills from 'rollup-plugin-polyfill-node'
const production = process.env.NODE_ENV === 'production'

export default {
  plugins: [
    // ↓ Needed for development mode
    !production &&
      nodePolyfills({
        include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
      })
  ],

  build: {
    rollupOptions: {
      plugins: [
        // ↓ Needed for build
        nodePolyfills()
      ]
    },
    // ↓ Needed for build if using WalletConnect and other providers
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}
```

## Provider Events

You can subscribe to provider events compatible with [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) standard.

```typescript
// Subscribe to accounts change
provider.on('accountsChanged', (accounts: string[]) => {
  console.log(accounts)
})

// Subscribe to chainId change
provider.on('chainChanged', (chainId: number) => {
  console.log(chainId)
})

// Subscribe to provider connection
provider.on('connect', (info: { chainId: number }) => {
  console.log(info)
})

// Subscribe to provider disconnection
provider.on('disconnect', (error: { code: number; message: string }) => {
  console.log(error)
})
```

# Internal events

```tsx
const context = useContext(WalletsContext)

const [current, setCurrentProvider] = useState<IProviderInfo>()
const [accounts, setAccounts] = useState<IChainWithAccount>({})

useEffect(() => {
  if (context) {
    context.on(WALLETS_EVENTS.CURRENT_WALLET, (provider: IProviderInfo) => {
      setCurrentProvider(provider)
    })

    context.on(WALLETS_EVENTS.ACCOUNTS, (newList: IChainWithAccount) => {
      setAccounts(newList)
    })
  }
}, [context])
```

# Hooks

```tsx
const accounts = useConnectedAccounts()

const isConnected = useStore((state) => state.connected)
const setIsConnected = useStore((state) => state.setConnected)

const onConnectHandler = useCallback(() => {
  setIsConnected(true)
}, [setIsConnected])
const onErrorHandler = useCallback(() => {
  setIsConnected(false)
}, [setIsConnected])
const onCloseHandler = useCallback(() => {
  setIsConnected(false)
}, [setIsConnected])

useWalletEvents(onConnectHandler, onCloseHandler, onErrorHandler)
```

# Custom Theme

```tsx

const CUSTOM_THEME_BUILDER = (darkMode: boolean): any => ({
  white: darkMode ? '#0969da' : '#9a6700',
  black: darkMode ? '#9a6700' : '#0969da',
  modal: {
    bg: darkMode ? '#2b2b2b' : '#E5E5E5',
    layoutBg: darkMode ? '#000000' : '#000000'
  },
  wallet: {
    name: darkMode ? '#9a6700' : '#333333',
    descColor: darkMode ? '#c4c4c4' : '#979797',
    titleColor: darkMode ? '#f2f1f1' : '#333333',
    bg: darkMode ? '#333333' : '#F2F1F1',
    activeBg: darkMode ? 'lightslategrey' : 'darkseagreen'
  }
})

...

<WalletsModal
  themeBuilder={CUSTOM_THEME_BUILDER}
  isDark={true} // true/false
  isSingleProviderEnabled={false} // true/false
  trigger={(props: any) => (
    <BtnOpen {...props}>Connect Styled Modal</BtnOpen>
  )}
/>
```

## Provider Options

These are all the providers available with library and how to configure their provider options:

- [WalletConnect](./docs/providers/walletconnect.md)
- [Coinbase Wallet](./docs/providers/coinbasewallet.md)
- [Fortmatic](./docs/providers/fortmatic.md)
- [Torus](./docs/providers/torus.md)
- [Portis](./docs/providers/portis.md)
- [Authereum](./docs/providers/authereum.md)
- [Frame](./docs/providers/frame.md)
- [Bitski](./docs/providers/bitski.md)
- [Venly](./docs/providers/venly.md)
- [DCent](./docs/providers/dcent.md)
- [BurnerConnect](./docs/providers/burnerconnect.md)
- [MEWConnect](./docs/providers/mewconnect.md)
- [Binance Chain Wallet](./docs/providers/binancechainwallet.md)
  [Opera Wallet](./docs/providers/opera.md)
- [Sequence](./docs/providers/sequence.md)
- [CLV Wallet](./docs/providers/clvwallet.md)
- [Web3Auth](./docs/providers/web3auth.md)
- [Bitkeep Wallet](./docs/providers/bitkeep.md)
- [99Starz Wallet](./docs/providers/starzwallet.md)

## Adding a new provider

Do you want to add your provider to Web3Modal? All logic for supported providers lives inside the `src/providers` directory. To add a new follow the following steps [here](docs/ADDING_PROVIDERS.md)

## Contributions

**Code contributions are welcome ❤️❤️❤️!**

If you wish to support a new provider submit a issue to the repo or fork this repo and create a pull request.

## License

MIT
