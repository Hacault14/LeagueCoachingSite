import React from 'react'
import { Layout } from '@/components/layout/Layout'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const AboutContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`

const Title = styled(motion.h1)`
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ContentCard = styled(motion.div)`
  background: ${props => props.theme.colors.background.card};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;

  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`

export default function About() {
  return (
    <Layout>
      <AboutContainer>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Our Coaching
        </Title>

        <ContentCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Our Mission</h2>
          <p>
            We're dedicated to helping players of all skill levels improve their League of Legends gameplay. 
            Our coaching methodology focuses on developing fundamental skills, game knowledge, and strategic thinking.
          </p>
        </ContentCard>

        <ContentCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2>Our Coaches</h2>
          <p>
            Our coaching team consists of high-elo players with extensive experience in competitive play and teaching. 
            Each coach specializes in different roles and champions, ensuring you get the most relevant expertise for your needs.
          </p>
        </ContentCard>
      </AboutContainer>
    </Layout>
  )
} 