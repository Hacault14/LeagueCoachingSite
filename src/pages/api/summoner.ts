import type { NextApiRequest, NextApiResponse } from 'next'

const REGION_ROUTING: { [key: string]: string } = {
  'na1': 'americas',
  'euw1': 'europe',
  'kr': 'asia',
  'br1': 'americas',
  'eun1': 'europe',
  'jp1': 'asia',
  'la1': 'americas',
  'la2': 'americas',
  'oc1': 'sea',
  'tr1': 'europe',
  'ru': 'europe',
}

async function getMatchDetails(matchId: string, region: string, apiKey: string) {
  const routingValue = REGION_ROUTING[region] || 'americas';
  const response = await fetch(
    `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    {
      headers: {
        'X-Riot-Token': apiKey
      }
    }
  );

  if (!response.ok) {
    console.error(`Failed to fetch match ${matchId}:`, await response.text());
    return null;
  }

  return response.json();
}

function determineRole(playerStats: any): string {
  // First check teamPosition as it's the most reliable
  if (playerStats.teamPosition && playerStats.teamPosition !== 'UTILITY') {
    const positions: { [key: string]: string } = {
      'TOP': 'Top',
      'JUNGLE': 'Jungle',
      'MIDDLE': 'Mid',
      'BOTTOM': 'ADC',
      'UTILITY': 'Support'
    };
    return positions[playerStats.teamPosition] || playerStats.teamPosition;
  }

  // Fallback to individualPosition if teamPosition is not available
  if (playerStats.individualPosition && playerStats.individualPosition !== 'Invalid') {
    const positions: { [key: string]: string } = {
      'TOP': 'Top',
      'JUNGLE': 'Jungle',
      'MIDDLE': 'Mid',
      'BOTTOM': 'ADC',
      'UTILITY': 'Support'
    };
    return positions[playerStats.individualPosition] || playerStats.individualPosition;
  }

  // If no position data is available (e.g., in ARAM)
  return playerStats.lane || 'Unknown';
}

function createCoachingPrompt(matches: any[], summonerData: any) {
  // Calculate averages
  const stats = matches.reduce((acc, match) => {
    acc.totalCS += match.cs;
    acc.totalCSPerMin += parseFloat(match.csPerMin);
    acc.totalKills += match.kills;
    acc.totalDeaths += match.deaths;
    acc.totalAssists += match.assists;
    acc.wins += match.win ? 1 : 0;
    return acc;
  }, {
    totalCS: 0,
    totalCSPerMin: 0,
    totalKills: 0,
    totalDeaths: 0,
    totalAssists: 0,
    wins: 0
  });

  // Get champion play rates
  const championCounts = matches.reduce((acc: {[key: string]: number}, match) => {
    acc[match.champion] = (acc[match.champion] || 0) + 1;
    return acc;
  }, {});

  const mostPlayedChampions = Object.entries(championCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([champion, count]) => `${champion} (${count} games)`);

  // Calculate role distribution
  const roleCount = matches.reduce((acc: {[key: string]: number}, match) => {
    acc[match.role] = (acc[match.role] || 0) + 1;
    return acc;
  }, {});

  const mainRoles = Object.entries(roleCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2)
    .map(([role, count]) => `${role} (${count} games)`);

  const gamesAnalyzed = matches.length;
  const avgCSPerMin = (stats.totalCSPerMin / gamesAnalyzed).toFixed(1);
  const avgKDA = ((stats.totalKills + stats.totalAssists) / Math.max(1, stats.totalDeaths)).toFixed(2);
  const winRate = ((stats.wins / gamesAnalyzed) * 100).toFixed(1);

  return `As a League of Legends coach, analyze this player's recent ${gamesAnalyzed} games:

Player Profile:
- Summoner Level: ${summonerData.summonerLevel}
- Games Analyzed: ${gamesAnalyzed}
- Main Roles: ${mainRoles.join(', ')}
- Win Rate: ${winRate}%
- Average CS per minute: ${avgCSPerMin}
- Average KDA: ${avgKDA}

Most Played Champions:
${mostPlayedChampions.map(champ => `- ${champ}`).join('\n')}

Recent Match History:
${matches.slice(0, 10).map((match, index) => `
Game ${index + 1}: ${match.champion} (${match.role})
- Result: ${match.win ? 'Victory' : 'Defeat'}
- KDA: ${match.kills}/${match.deaths}/${match.assists} (${match.kda})
- CS: ${match.cs} (${match.csPerMin}/min)
- Duration: ${match.gameDuration} minutes
`).join('\n')}

Based on these ${gamesAnalyzed} games:

Strengths:
[List 3-4 key strengths you observe from their statistics and champion pool]

Weaknesses:
[List 3-4 main areas where the player needs improvement]

Improvements:
[Provide 4-5 specific, actionable tips for improvement based on their performance]

Champion Recommendations:
[Based on their playstyle and current champion pool, recommend 2-3 champions they should focus on or try]

Please format your response with these exact section headers and provide bullet points under each section.`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { gameName, tagLine, region = 'na1' } = req.query as { 
    gameName: string, 
    tagLine: string, 
    region: string 
  };
  console.log('Request params:', { gameName, tagLine, region })

  if (!gameName || !tagLine) {
    return res.status(400).json({ error: 'Game name and tag line are required' })
  }

  if (!process.env.RIOT_API_KEY) {
    console.error('RIOT_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Step 1: Get PUUID using Riot ID (gameName + tagLine)
    const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName as string)}/${encodeURIComponent(tagLine as string)}`;
    console.log('Fetching account data from:', accountUrl);

    const accountResponse = await fetch(accountUrl, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      }
    });

    if (!accountResponse.ok) {
      const errorText = await accountResponse.text();
      throw new Error(`Account API Error: ${errorText}`);
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;

    // Step 2: Get summoner data using PUUID
    const regionalApi = `https://${region.toLowerCase()}.api.riotgames.com`;
    const summonerUrl = `${regionalApi}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    console.log('Fetching summoner data from:', summonerUrl);

    const summonerResponse = await fetch(summonerUrl, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      }
    });

    if (!summonerResponse.ok) {
      const errorText = await summonerResponse.text();
      throw new Error(`Summoner API Error: ${errorText}`);
    }

    const summonerData = await summonerResponse.json();
    console.log('Summoner data:', summonerData);

    // Step 3: Get recent matches
    const routingValue = REGION_ROUTING[region as string] || 'americas';
    const matchListUrl = `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20`;
    
    const matchListResponse = await fetch(matchListUrl, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY as string
      }
    });

    if (!matchListResponse.ok) {
      throw new Error(`Match list API Error: ${await matchListResponse.text()}`);
    }

    const matchIds = await matchListResponse.json();

    // Step 4: Get details for each match
    const matchDetails = await Promise.all(
      matchIds.map((matchId: string) => getMatchDetails(matchId, region as string, process.env.RIOT_API_KEY as string))
    );

    // Step 5: Process match data to calculate stats
    const processedMatches = matchDetails
      .filter(match => match !== null)
      .map(match => {
        const playerStats = match.info.participants.find(
          (p: any) => p.puuid === puuid
        );

        const gameDurationMinutes = match.info.gameDuration / 60;
        const role = determineRole(playerStats);
        
        return {
          gameId: match.info.gameId,
          champion: playerStats.championName,
          role: role,
          win: playerStats.win,
          kills: playerStats.kills,
          deaths: playerStats.deaths,
          assists: playerStats.assists,
          kda: playerStats.deaths === 0 
            ? `Perfect (${playerStats.kills + playerStats.assists})`
            : ((playerStats.kills + playerStats.assists) / playerStats.deaths).toFixed(2),
          cs: playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled,
          csPerMin: ((playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled) / gameDurationMinutes).toFixed(1),
          gameDuration: Math.round(gameDurationMinutes),
          gameMode: match.info.gameMode,
          timestamp: match.info.gameCreation
        };
      });

    // Create coaching prompt
    const coachingPrompt = createCoachingPrompt(processedMatches, summonerData);

    res.status(200).json({
      account: accountData,
      summoner: summonerData,
      matches: processedMatches,
      coachingPrompt // Include the prompt in the response
    });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 