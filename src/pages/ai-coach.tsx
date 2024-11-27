import React, { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const AICoachContainer = styled.div`
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

const SearchContainer = styled(ContentCard)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const Label = styled.label`
  color: ${props => props.theme.colors.text.primary};
  font-weight: 500;
`

const Input = styled.input`
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
`

const Select = styled.select`
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
`

const Button = styled(motion.button)`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: none;
  border-radius: 6px;
  padding: 1rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.animations.hover};
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 168, 255, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

const ErrorText = styled.p`
  color: #ff5555;
  margin-top: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
`

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

const MatchCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .champion {
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }

  .stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .win {
    color: #4ade80;
  }

  .loss {
    color: #f87171;
  }
`

const StatLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
`

const CoachingSection = styled(ContentCard)`
  margin-top: 2rem;
  
  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }

  .stats-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .stat-item {
    text-align: center;
    
    .label {
      color: ${props => props.theme.colors.text.secondary};
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }
    
    .value {
      font-size: 1.2rem;
      font-weight: bold;
      color: ${props => props.theme.colors.primary};
    }
  }
`

const CoachingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`

const CoachingCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h4 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      padding-left: 1.2rem;
      position: relative;

      &:before {
        content: "•";
        color: ${props => props.theme.colors.primary};
        position: absolute;
        left: 0;
      }
    }
  }
`

interface Match {
  gameId: string;
  champion: string;
  win: boolean;
  gameMode: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  cs: number;
  csPerMin: number;
  gameDuration: number;
  timestamp: number;
}

const formatCoachingInsights = (text: string) => {
  const sections = {
    strengths: '',
    weaknesses: '',
    improvements: '',
    champions: ''
  };

  // Split the text into sections based on headers
  const parts = text.split(/(?=Strengths:|Weaknesses:|Improvements:|Champion Recommendations:)/i);
  
  parts.forEach(part => {
    if (part.match(/^Strengths:/i)) {
      sections.strengths = part.replace(/^Strengths:/i, '').trim();
    } else if (part.match(/^Weaknesses:/i)) {
      sections.weaknesses = part.replace(/^Weaknesses:/i, '').trim();
    } else if (part.match(/^Improvements:/i)) {
      sections.improvements = part.replace(/^Improvements:/i, '').trim();
    } else if (part.match(/^Champion Recommendations:/i)) {
      sections.champions = part.replace(/^Champion Recommendations:/i, '').trim();
    }
  });

  return sections;
};

export default function AICoach() {
  const [gameName, setGameName] = useState('')
  const [tagLine, setTagLine] = useState('')
  const [region, setRegion] = useState('na1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<{ matches: Match[] } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coachingInsights, setCoachingInsights] = useState<string>('');

  const regions = [
    { value: 'na1', label: 'North America' },
    { value: 'euw1', label: 'Europe West' },
    { value: 'kr', label: 'Korea' },
    { value: 'br1', label: 'Brazil' },
    { value: 'eun1', label: 'Europe Nordic & East' },
    { value: 'jp1', label: 'Japan' },
    { value: 'la1', label: 'Latin America North' },
    { value: 'la2', label: 'Latin America South' },
    { value: 'oc1', label: 'Oceania' },
    { value: 'tr1', label: 'Turkey' },
    { value: 'ru', label: 'Russia' },
  ]

  const getCoachingInsights = async (prompt: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/coaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get coaching insights');
      }

      const data = await response.json();
      setCoachingInsights(data.advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate coaching insights');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `/api/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}&region=${region}`
      )
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch summoner data')
      }
      
      setData(data)
      if (data.coachingPrompt) {
        await getCoachingInsights(data.coachingPrompt);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <AICoachContainer>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          AI Coaching Assistant
        </Title>

        <SearchContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2>Analyze Your Performance</h2>
          <p>Enter your Riot ID (Example: PlayerName#NA1)</p>
          
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <FormGroup>
                <Label>Game Name</Label>
                <Input
                  required
                  placeholder="PlayerName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Tag Line</Label>
                <Input
                  required
                  placeholder="NA1"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  style={{ width: '100px' }}
                />
              </FormGroup>
            </InputGroup>

            <FormGroup>
              <Label>Region</Label>
              <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                {regions.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <Button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </form>

          {error && <ErrorText>{error}</ErrorText>}

          {data && (
            <>
              <MatchList>
                <h3>Recent Matches:</h3>
                {data.matches.map((match: any) => (
                  <MatchCard key={match.gameId}>
                    <div className="stats">
                      <div className="champion">{match.champion}</div>
                      <div className="role">{match.role}</div>
                      <div className={match.win ? 'win' : 'loss'}>
                        {match.win ? 'Victory' : 'Defeat'}
                      </div>
                      <div>{match.gameMode}</div>
                    </div>
                    
                    <div className="stats">
                      <div>
                        <StatLabel>KDA: </StatLabel>
                        {match.kills}/{match.deaths}/{match.assists} ({match.kda})
                      </div>
                      <div>
                        <StatLabel>CS: </StatLabel>
                        {match.cs} ({match.csPerMin}/min)
                      </div>
                    </div>
                    
                    <div className="stats">
                      <div>
                        <StatLabel>Duration: </StatLabel>
                        {match.gameDuration} minutes
                      </div>
                      <div>
                        <StatLabel>Played: </StatLabel>
                        {new Date(match.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </MatchCard>
                ))}
              </MatchList>
              
              <CoachingSection>
                <h3>Coaching Analysis</h3>
                <div className="stats-summary">
                  <div className="stat-item">
                    <div className="label">Average CS/min</div>
                    <div className="value">
                      {(data.matches.reduce((acc: number, match: any) => 
                        acc + parseFloat(match.csPerMin), 0) / data.matches.length).toFixed(1)}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Win Rate</div>
                    <div className="value">
                      {((data.matches.filter((m: any) => m.win).length / data.matches.length) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Average KDA</div>
                    <div className="value">
                      {((data.matches.reduce((acc: number, m: any) => 
                        acc + parseFloat(m.kda), 0)) / data.matches.length).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {isAnalyzing ? (
                  <div>Analyzing your performance...</div>
                ) : coachingInsights ? (
                  <>
                    <CoachingGrid>
                      <CoachingCard>
                        <h4>💪 Strengths</h4>
                        <div>{formatCoachingInsights(coachingInsights).strengths}</div>
                      </CoachingCard>
                      
                      <CoachingCard>
                        <h4>🎯 Areas for Improvement</h4>
                        <div>{formatCoachingInsights(coachingInsights).weaknesses}</div>
                      </CoachingCard>
                      
                      <CoachingCard>
                        <h4>📈 Action Items</h4>
                        <div>{formatCoachingInsights(coachingInsights).improvements}</div>
                      </CoachingCard>
                      
                      <CoachingCard>
                        <h4>🏆 Champion Recommendations</h4>
                        <div>{formatCoachingInsights(coachingInsights).champions}</div>
                      </CoachingCard>
                    </CoachingGrid>
                  </>
                ) : null}
              </CoachingSection>
            </>
          )}
        </SearchContainer>
      </AICoachContainer>
    </Layout>
  )
} 