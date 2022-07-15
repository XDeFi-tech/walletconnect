import React from 'react'
import styled from 'styled-components'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from 'react-router-dom'

import SingleProviderPage from './pages/SingleProviderPage'
import MultiProvidersPage from './pages/MultiProvidersPage'

const Nav = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
`

const LinkStyled = styled(Link)<{ current?: boolean }>`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ current }) => (current ? 1 : 0.4)};
  background: ${({ current }) => (current ? 'green' : 'initial')};
  color: black;
`

const PATHS = {
  multi: '/multi',
  single: '/single'
}

const Navigation = () => {
  const location = useLocation()

  return (
    <Nav>
      <LinkStyled current={location.pathname === PATHS.multi} to={PATHS.multi}>
        Multi Wallets Connection
      </LinkStyled>
      <LinkStyled
        current={location.pathname === PATHS.single}
        to={PATHS.single}
      >
        Single Wallet Connection
      </LinkStyled>
    </Nav>
  )
}

function App() {
  return (
    <Router>
      <div>
        <Navigation />

        <Routes>
          <Route path='/multi' element={<MultiProvidersPage />} />
          <Route path='/single' element={<SingleProviderPage />} />
          <Route path='*' element={<Navigate to='/single' />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
