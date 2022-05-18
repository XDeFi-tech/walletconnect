# wallets-connector

## Install

```bash
yarn add @xdefi-tech/wallets-connector
```

## Usage

```tsx
const getProviderOptions = (): IProviderOptions => {
  const infuraId = 'blablaid'
  const providerOptions = {
    walletconnect: {
      package: WalletConnect,
      options: {
        infuraId
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Coinbase Example App',
        infuraId
      }
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

const { provider, accounts } = useWalletsConnector()

const accounts = useConnectedAccounts()
```
