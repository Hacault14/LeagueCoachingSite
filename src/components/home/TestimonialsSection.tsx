import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const Section = styled.section`
  padding: 4rem 2rem;
  background: ${props => props.theme.colors.background.darker};
  position: relative;
`

const Title = styled(motion.h2)`
  text-align: center;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 3rem;
`

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const TestimonialCard = styled(motion.div)`
  background: ${props => props.theme.colors.background.card};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  blockquote {
    color: ${props => props.theme.colors.text.secondary};
    font-style: italic;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
`

const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const AuthorImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
`

const AuthorInfo = styled.div`
  h4 {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.25rem;
  }

  p {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`

export const TestimonialsSection: React.FC = () => {
  return (
    <Section>
      <Title
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        What Our Students Say
      </Title>
      <TestimonialsGrid>
        <TestimonialCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <blockquote>
            "After just a few sessions, my map awareness and decision-making improved dramatically. 
            Climbed from Gold to Diamond in one season!"
          </blockquote>
          <Author>
            <AuthorImage />
            <AuthorInfo>
              <h4>Sarah Chen</h4>
              <p>Diamond II Mid Laner</p>
            </AuthorInfo>
          </Author>
        </TestimonialCard>

        <TestimonialCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <blockquote>
            "The VOD reviews were eye-opening. They helped me understand my mistakes 
            and gave me clear strategies to improve my gameplay."
          </blockquote>
          <Author>
            <AuthorImage />
            <AuthorInfo>
              <h4>Marcus Rodriguez</h4>
              <p>Platinum I Jungler</p>
            </AuthorInfo>
          </Author>
        </TestimonialCard>

        <TestimonialCard
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <blockquote>
            "The coaches here don't just tell you what to do - they explain why. 
            This helped me develop better game sense and climb consistently."
          </blockquote>
          <Author>
            <AuthorImage />
            <AuthorInfo>
              <h4>Emma Thompson</h4>
              <p>Master Support Main</p>
            </AuthorInfo>
          </Author>
        </TestimonialCard>
      </TestimonialsGrid>
    </Section>
  )
} 