import React from 'react'

import MyApp from './connector/example/MyApp'
import NetworkManager from './connector/NetworkManager'

function App() {
  return (
    <NetworkManager>
      <MyApp />
    </NetworkManager>
  )
}

export default App
