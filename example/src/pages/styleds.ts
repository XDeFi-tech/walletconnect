import styled from 'styled-components'
import Wrapper from 'src/components/Wrapper'

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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 16px;
`

export const SBlock = styled.div`
  display: block;
  border-bottom: 2px solid black;
  padding: 16px;
  width: 100%;
`

export const SProvider = styled.div`
  font-size: 26px;
  padding-bottom: 16px;
`
