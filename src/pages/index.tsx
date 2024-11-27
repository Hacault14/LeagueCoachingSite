import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/home/Hero'
import { SocialSection } from '@/components/home/SocialSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <SocialSection />
      <TestimonialsSection />
    </Layout>
  )
} 