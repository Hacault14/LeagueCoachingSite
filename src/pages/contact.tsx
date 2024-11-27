import React from 'react'
import { Layout } from '@/components/layout/Layout'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const ContactContainer = styled.div`
  max-width: 600px;
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

const ContactForm = styled(motion.form)`
  background: ${props => props.theme.colors.background.card};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.5rem;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: ${props => props.theme.colors.text.primary};
    transition: ${props => props.theme.animations.hover};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}40;
    }
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }
`

const SubmitButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: 6px;
  padding: 1rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.animations.hover};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 168, 255, 0.3);
  }
`

export default function Contact() {
  return (
    <Layout>
      <ContactContainer>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get in Touch
        </Title>

        <ContactForm
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <FormGroup>
            <label>Name</label>
            <input type="text" placeholder="Your name" />
          </FormGroup>

          <FormGroup>
            <label>Email</label>
            <input type="email" placeholder="your@email.com" />
          </FormGroup>

          <FormGroup>
            <label>Message</label>
            <textarea placeholder="How can we help you?" />
          </FormGroup>

          <SubmitButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
          >
            Send Message
          </SubmitButton>
        </ContactForm>
      </ContactContainer>
    </Layout>
  )
} 