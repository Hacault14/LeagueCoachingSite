import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const HeroSection = styled.section`
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  overflow: hidden;
`

const Content = styled.div`
  text-align: center;
  z-index: 2;
`

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 2.5rem;
  }
`

const HeroText = styled(motion.p)`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin: 0 auto;
`

const FloatingLogo = styled(motion.div)`
  position: absolute;
  filter: drop-shadow(0 0 20px ${props => props.theme.colors.primary}40);
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
`

const RankImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`

export const Hero: React.FC = () => {
  return (
    <HeroSection>
      <Content>
        <HeroTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Elevate Your League Game
        </HeroTitle>
        <HeroText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Professional coaching to help you master the rift and climb the ranks
        </HeroText>
      </Content>
      
      <FloatingLogo
        style={{ top: '15%', left: '10%', width: '120px', height: '120px' }}
        animate={{
          y: [0, 20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <RankImage src="/ranks/challenger.png" alt="Challenger Rank" />
      </FloatingLogo>
      
      <FloatingLogo
        style={{ bottom: '15%', right: '10%', width: '150px', height: '150px' }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <RankImage src="/ranks/challenger.png" alt="Challenger Rank" />
      </FloatingLogo>
    </HeroSection>
  )
} 