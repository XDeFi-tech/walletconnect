import styled from 'styled-components'
import Wrapper from 'src/components/Wrapper'
import Column from 'src/components/Column'

export const SLayoutSingle = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background: aliceblue;
`
export const SLayoutMulti = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background: antiquewhite;
`

export const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`

export const SLanding = styled(Column)``

export const SBalances = styled(SLanding)`
  height: 100%;

  & h3 {
    padding-top: 30px;
  }
`
