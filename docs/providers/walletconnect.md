# WalletConnect

1. Install Provider Package

```bash
npm install --save @walletconnect/web3-provider

# OR

yarn add @walletconnect/web3-provider
```

2. Set Provider Options

```typescript
import WalletConnectProvider from '@walletconnect/web3-provider'

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: 'INFURA_ID' // required
    }
  }
}
```

**Note:** A WalletConnect instance is available on the provider as `provider.wc`
