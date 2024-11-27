import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const Section = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  background: ${props => props.theme.colors.background.card};
  backdrop-filter: blur(10px);
`

const Title = styled(motion.h2)`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2rem;
`

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const SocialCard = styled(motion.a)`
  background: ${props => props.theme.colors.background.darker};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: ${props => props.theme.animations.hover};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: translateY(-5px);
    border-color: ${props => props.theme.colors.primary};
  }

  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
  }
`

export const SocialSection: React.FC = () => {
  return (
    <Section>
      <Title
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Connect With Us
      </Title>
      <SocialGrid>
        <SocialCard 
          href="https://twitch.tv" 
          target="_blank"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3>Live Coaching on Twitch</h3>
          <p>Watch live coaching sessions and learn from other players' mistakes</p>
        </SocialCard>

        <SocialCard 
          href="https://discord.gg" 
          target="_blank"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h3>Join our Discord</h3>
          <p>Connect with other players, share tips, and find duo partners</p>
        </SocialCard>

        <SocialCard 
          href="https://youtube.com" 
          target="_blank"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>YouTube Guides</h3>
          <p>In-depth champion guides, macro tutorials, and coaching VODs</p>
        </SocialCard>
      </SocialGrid>
    </Section>
  )
} 