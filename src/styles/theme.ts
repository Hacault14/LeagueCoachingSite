export const theme = {
  colors: {
    primary: '#00a8ff',
    secondary: '#9c1de7',
    accent: '#2ecc71',
    background: {
      dark: '#0a0a0a',
      darker: '#050505',
      card: 'rgba(255, 255, 255, 0.05)',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      accent: '#00a8ff',
    }
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Poppins', sans-serif",
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
  animations: {
    hover: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    glow: 'glow 2s ease-in-out infinite alternate',
  }
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof theme.colors
    fonts: typeof theme.fonts
    breakpoints: typeof theme.breakpoints
    animations: typeof theme.animations
  }
} 