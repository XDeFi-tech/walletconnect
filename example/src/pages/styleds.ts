import styled from 'styled-components'
import Wrapper from 'src/components/Wrapper'

export const SLayoutSingle = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  text-align: center;
  background: aliceblue;
`
export const SLayoutMulti = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  text-align: center;
  background: antiquewhite;
`

export const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 8px;
`

export const SBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-top: 2px solid black;
  padding: 16px;
`

export const SProvider = styled.div`
  font-size: 26px;
  padding-bottom: 16px;
`
