import React from 'react'
import { Layout } from '@/components/layout/Layout'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const BookingContainer = styled.div`
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

const BookingCard = styled(motion.div)`
  background: ${props => props.theme.colors.background.card};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;

  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
`

const BookButton = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: 6px;
  padding: 1rem 2rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.animations.hover};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 168, 255, 0.3);
  }
`

export default function Booking() {
  return (
    <Layout>
      <BookingContainer>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Book Your Coaching Session
        </Title>

        <BookingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3>1-on-1 Coaching Session</h3>
          <p>Personal coaching tailored to your needs. Includes game analysis, strategy development, and practical exercises.</p>
          <BookButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Book Now - $50/hour
          </BookButton>
        </BookingCard>

        <BookingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h3>VOD Review</h3>
          <p>Detailed analysis of your gameplay recordings with actionable feedback and improvement strategies.</p>
          <BookButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Book Now - $30/session
          </BookButton>
        </BookingCard>
      </BookingContainer>
    </Layout>
  )
} 