import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'

@font-face {
  font-family: 'BeaufortForLOL';
  src: url('/fonts/BeaufortForLOL-Bold.woff2') format('woff2');
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: 'Spiegel';
  src: url('/fonts/Spiegel-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.primary};
  }

  a {
    color: ${theme.colors.secondary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.primary};
    }
  }
`

export default GlobalStyles 