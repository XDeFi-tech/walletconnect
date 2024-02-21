# WalletConnect

For more info please refer to Torus [documentation](https://docs.walletconnect.com/advanced/providers/ethereum)

1. Install Provider Package

```bash
npm install --save @walletconnect/ethereum-provider

# OR

yarn add @walletconnect/ethereum-provider
```

2. Set Provider Options

```typescript
import { EthereumProvider } from '@walletconnect/ethereum-provider'

const providerOptions = {
  walletconnect: {
    package: EthereumProvider,
    options: {
      projectId: <projectId>,
      chains: [1],
      showQrModal: true,
      metadata: {
        name: 'XDEFI Swap & Bridge',
        description: 'XDEFI Swap & Bridge',
        url: 'https://app.xdefi.io',
        icons: ['https://app.xdefi.io/logo512.png']
      }
    }
  }
}
```

https://docs.walletconnect.com/advanced/providers/ethereum
