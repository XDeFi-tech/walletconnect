# Wallets Connector

```
  const getProviderOptions = (): IProviderOptions => {
    const infuraId = 'blablaid'
    const providerOptions = {
      walletconnect: {
        package: WalletConnect,
        options: {
          infuraId,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: 'Coinbase Example App',
          infuraId,
        },
      },
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

```
  const context = React.useContext(WalletsContext)

  const [current, setCurrentProvider] = React.useState<IProviderInfo>()
  const [accounts, setAccounts] = React.useState<IChainWithAccount>({})

  React.useEffect(() => {
    if (context) {
      context.on(WALLETS_EVENTS.CURRENT_WALLET, (provider: IProviderInfo) => {
        setCurrentProvider(provider)
      })

      context.on(
        WALLETS_EVENTS.ACCOUNTS,
        (newList: IChainWithAccount) => {
          setAccounts(newList)
        }
      )
    }
  }, [context])
```
