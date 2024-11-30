import React, { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Image from 'next/image';

const AICoachContainer = styled.div`
  width: 66vw;
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
  width: 100%;
  margin-bottom: 2rem;
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
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: flex-end;
`

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`

const MatchCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0;
  padding: 0.5rem;
  display: flex;
  gap: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  align-items: center;

  .champion-image {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

  .stats-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    
    .left {
      text-align: left;
    }
    
    .center {
      text-align: center;
    }
    
    .right {
      text-align: right;
    }
  }

  .champion {
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
    font-size: 0.85rem;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  }

  .criticism-point {
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.5rem;
      padding-left: 1.2rem;
      position: relative;
      color: ${props => props.theme.colors.text.secondary};

      &:before {
        content: "•";
        color: ${props => props.theme.colors.primary};
        position: absolute;
        left: 0;
      }
    }
  }
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 35% 63%;
  gap: 2%;
  width: 100%;
`

const StatsSection = styled(ContentCard)`
  height: fit-content;
  margin-top: 2rem;
`

interface RankSectionProps {
  tier: string;
}

const RankSection = styled(ContentCard)<RankSectionProps>`
  height: fit-content;
  margin: 2rem 0 1rem 0;

  .rank-display {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    
    .rank-image {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    
    .rank-info-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .rank-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .rank-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: ${props => getRankColor(props.tier as string)};
      }
      
      .lp {
        color: ${props => props.theme.colors.text.secondary};
        font-size: 1rem;
      }
    }

    .role-and-winrate {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: ${props => props.theme.colors.text.secondary};
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .winrate {
      color: ${props => props.theme.colors.text.secondary};
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

interface ChampionStat {
  championName: string;
  gamesPlayed: number;
  winRate: string;
  avgKills: string;
  avgDeaths: string;
  avgAssists: string;
  kda: string;
  avgCSPerMin: string;
  avgCSPerGame: number;
}

const formatCoachingInsights = (text: string) => {
  const goals: { header: string; suggestions: string[] }[] = [];
  
  // Split by "[Goal X]" markers
  const parts = text.split(/\[Goal \d+\]/g).filter(Boolean);
  
  parts.forEach(part => {
    const lines = part.split('\n').filter(Boolean);
    if (lines.length >= 2) {
      // First non-empty line after the [Goal X] marker is our header
      const header = lines[0].trim();
      const suggestions = lines
        .slice(1)  // Skip the header line
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(1).trim());
      
      if (header && suggestions.length > 0) {
        goals.push({ header, suggestions });
      }
    }
  });

  return goals;
};

const getRankImageUrl = (tier: string) => {
  const lowerTier = tier?.toLowerCase() || 'unranked';
  return `http://localhost:3000/ranks/${lowerTier}.png`;
};

const getChampionImageUrl = (championName: string) => {
  return `https://ddragon.leagueoflegends.com/cdn/13.24.1/img/champion/${championName}.png`;
};

const formatRoleName = (role: string): string => {
  const roleMap: { [key: string]: string } = {
    'Top': 'Top Laner',
    'Jungle': 'Jungler',
    'Mid': 'Mid Laner',
    'ADC': 'Bot Laner',
    'Support': 'Support'
  };
  return roleMap[role] || role;
};

const getRankColor = (tier: string): string => {
  const colors: { [key: string]: string } = {
    'IRON': '#91767c',
    'BRONZE': '#a6744b',
    'SILVER': '#97b0bc',
    'GOLD': '#edb347',
    'PLATINUM': '#4ba1a1',
    'EMERALD': '#4ba174',
    'DIAMOND': '#7d7ce5',
    'MASTER': '#9d4dc3',
    'GRANDMASTER': '#c9382c',
    'CHALLENGER': '#f4c874',
  };
  return colors[tier.toUpperCase()] || '#00a8ff';
};

export default function AICoach() {
  const [gameName, setGameName] = useState('')
  const [tagLine, setTagLine] = useState('')
  const [region, setRegion] = useState('na1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<{
    matches?: Match[];
    championStats: ChampionStat[];
    rankedStats?: any[];
    mainRole?: string;
  } | null>(null)
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
      console.log('Raw GPT Response:', data.advice);
      //console.log('Parsed Criticisms:', formatCoachingInsights(data.advice));
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
            </InputGroup>

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
            <ContentGrid>
              <div>
                <RankSection
                  tier={data.rankedStats?.find((queue: any) => 
                    queue.queueType === 'RANKED_SOLO_5x5')?.tier || 'unranked'}
                >
                  <div className="rank-display">
                    {data.rankedStats?.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5') ? (
                      <>
                        <Image 
                          className="rank-image"
                          src={getRankImageUrl(data.rankedStats.find((queue: any) => 
                            queue.queueType === 'RANKED_SOLO_5x5').tier)}
                          alt="Rank emblem"
                          width={80}
                          height={80}
                          priority
                        />
                        <div className="rank-info-container">
                          <div className="rank-info">
                            <span 
                              className="rank-name"
                              data-tier={data.rankedStats.find((queue: any) => 
                                queue.queueType === 'RANKED_SOLO_5x5').tier}
                            >
                              {data.rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5').tier} {' '}
                              {data.rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5').rank}
                            </span>
                            <span className="lp">
                              {data.rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5').leaguePoints} LP
                            </span>
                          </div>
                          {data.mainRole && (
                            <div className="role-and-winrate">
                              <span>{formatRoleName(data.mainRole)}</span>
                              <span className="winrate">
                                {((data.rankedStats.find((queue: any) => 
                                  queue.queueType === 'RANKED_SOLO_5x5').wins /
                                  (data.rankedStats.find((queue: any) => 
                                    queue.queueType === 'RANKED_SOLO_5x5').wins +
                                   data.rankedStats.find((queue: any) => 
                                    queue.queueType === 'RANKED_SOLO_5x5').losses)) * 100).toFixed(1)}% WR
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <Image 
                          className="rank-image"
                          src={getRankImageUrl('unranked')}
                          alt="Unranked emblem"
                          width={80}
                          height={80}
                          priority
                        />
                        <div className="rank-info">Unranked</div>
                      </>
                    )}
                  </div>
                </RankSection>
                <StatsSection>
                  <h3>Champion Statistics</h3>
                  {data.championStats.map((champion: any) => (
                    <MatchCard key={champion.championName}>
                      <Image
                        className="champion-image"
                        src={getChampionImageUrl(champion.championName)}
                        alt={champion.championName}
                        width={40}
                        height={40}
                        priority
                      />
                      <div className="stats-container">
                        <div className="row">
                          <div className="left champion">{champion.championName}</div>
                          <div className="center">
                            KDA: {champion.kda}
                          </div>
                          <div className="right">
                            <span className={Number(champion.winRate) >= 50 ? 'win' : 'loss'}>
                              {champion.winRate}% WR
                            </span>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="left">
                            CS/min: {champion.avgCSPerMin}
                          </div>
                          <div className="center">
                            {champion.avgKills}/{champion.avgDeaths}/{champion.avgAssists}
                          </div>
                          <div className="right">
                            {champion.gamesPlayed} games
                          </div>
                        </div>
                      </div>
                    </MatchCard>
                  ))}
                </StatsSection>
              </div>

              <CoachingSection>
                <h3>Coaching Analysis</h3>
                <div className="stats-summary">
                  <div className="stat-item">
                    <div className="label">Average CS/min</div>
                    <div className="value">
                      {(data.championStats.reduce((acc, champ) => 
                        acc + parseFloat(champ.avgCSPerMin), 0) / data.championStats.length).toFixed(1)}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Win Rate</div>
                    <div className="value">
                      {data.rankedStats?.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5')
                        ? ((data.rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5').wins /
                          (data.rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5').wins +
                           data.rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5').losses)) * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="label">Average KDA</div>
                    <div className="value">
                      {(data.championStats.reduce((acc, champ) => 
                        acc + parseFloat(champ.kda), 0) / data.championStats.length).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {isAnalyzing ? (
                  <div>Analyzing your performance...</div>
                ) : coachingInsights ? (
                  <CoachingGrid>
                    {formatCoachingInsights(coachingInsights).map((goal, index) => (
                      <CoachingCard key={index}>
                        <h4>{goal.header}</h4>
                        <div className="coaching-content">
                          <ul>
                            {goal.suggestions.map((suggestion, i) => (
                              <li key={i}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </CoachingCard>
                    ))}
                  </CoachingGrid>
                ) : null}
              </CoachingSection>
            </ContentGrid>
          )}
        </SearchContainer>
      </AICoachContainer>
    </Layout>
  )
} 