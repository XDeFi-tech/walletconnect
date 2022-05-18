# Cross chain wallets-connector

It can use different wallets with configs for different providers (EVM-chains, bitcoin/litcoin/etc)

just check example of usage XDEFI wallet:

https://github.com/XDeFi-tech/walletconnect/blob/master/src/providers/injected/index.ts#L146

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
