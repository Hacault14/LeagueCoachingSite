import { createGlobalStyle, keyframes } from 'styled-components'
import { theme } from './theme'

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const glow = keyframes`
  from {
    box-shadow: 0 0 5px ${theme.colors.primary},
                0 0 10px ${theme.colors.primary},
                0 0 15px ${theme.colors.secondary};
  }
  to {
    box-shadow: 0 0 10px ${theme.colors.primary},
                0 0 20px ${theme.colors.primary},
                0 0 30px ${theme.colors.secondary};
  }
`

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.dark};
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${theme.colors.background.gradient};
    background-size: 400% 400%;
    animation: ${gradient} 15s ease infinite;
    z-index: -1;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.text.primary};
  }

  .card {
    background: ${theme.colors.background.card};
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    transition: ${theme.animations.hover};
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      border-color: ${theme.colors.primary}40;
    }
  }

  .glow {
    animation: ${glow} 2s ease-in-out infinite alternate;
  }
` 