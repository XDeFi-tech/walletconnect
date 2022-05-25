# wallets-connector

## Install

```bash
yarn add wallets-connector
```

## Usage

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
