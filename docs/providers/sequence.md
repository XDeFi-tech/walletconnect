# Sequence

See https://docs.sequence.build for more information.

1. Install Provider Package

```bash
npm install --save 0xsequence

# OR

yarn add 0xsequence
```

2. Set Provider Options

```ts
import { sequence } from "0xsequence";

const providerOptions = {
  sequence: {
    package: sequence, // required
    options: {
      appName: "My App" // optional
      defaultNetwork: "polygon" // optional
    }
  }
};
```
