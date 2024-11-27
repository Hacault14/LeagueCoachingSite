import React from 'react'
import { Header } from './Header'
import styled from 'styled-components'

const Main = styled.main`
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  position: relative;
  z-index: 1;
`

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  )
} 