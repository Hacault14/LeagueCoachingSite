import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.background.dark};
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`

const Logo = styled.div`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.primary};

  a {
    text-decoration: none;
    color: inherit;
    transition: ${props => props.theme.animations.hover};
    
    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.text.primary};
    transition: ${props => props.theme.animations.hover};
    
    &:hover {
      color: ${props => props.theme.colors.primary};
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Nav>
        <Logo>
          <Link href="/">LoL Coaching</Link>
        </Logo>
        <NavLinks>
          <Link href="/booking">Book Session</Link>
          <Link href="/ai-coach">AI Coach</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  )
} 