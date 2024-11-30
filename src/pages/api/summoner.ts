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

interface ChampionStats {
  championName: string;
  gamesPlayed: number;
  wins: number;
  totalKills: number;
  totalDeaths: number;
  totalAssists: number;
  totalCS: number;
  totalGameDuration: number;
  totalVisionScore: number;
}

interface RoleStats {
  games: number;
  wins: number;
  percentage: number;
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

async function getRankedStats(summonerId: string, region: string, apiKey: string) {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
    {
      headers: {
        'X-Riot-Token': apiKey
      }
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch ranked stats:', await response.text());
    return null;
  }

  return response.json();
}

function calculateChampionStats(matches: any[], puuid: string) {
  const championStats: { [key: string]: ChampionStats } = {};

  matches.forEach(match => {
    // Skip remade games (games shorter than 5 minutes)
    if (match.info.gameDuration < 300) return;  // 300 seconds = 5 minutes
    
    // Only process ranked games
    if (match.info.queueId !== 420 && match.info.queueId !== 440) return;
    
    const playerStats = match.info.participants.find(
      (p: any) => p.puuid === puuid
    );

    if (!playerStats) return;

    const championName = playerStats.championName;
    const gameDurationMinutes = match.info.gameDuration / 60;

    if (!championStats[championName]) {
      championStats[championName] = {
        championName,
        gamesPlayed: 0,
        wins: 0,
        totalKills: 0,
        totalDeaths: 0,
        totalAssists: 0,
        totalCS: 0,
        totalGameDuration: 0,
        totalVisionScore: 0
      };
    }

    championStats[championName].gamesPlayed++;
    championStats[championName].wins += playerStats.win ? 1 : 0;
    championStats[championName].totalKills += playerStats.kills;
    championStats[championName].totalDeaths += playerStats.deaths;
    championStats[championName].totalAssists += playerStats.assists;
    championStats[championName].totalCS += playerStats.totalMinionsKilled + playerStats.neutralMinionsKilled;
    championStats[championName].totalGameDuration += gameDurationMinutes;
    championStats[championName].totalVisionScore += playerStats.visionScore;
  });

  return Object.values(championStats)
    .map(stats => ({
      championName: stats.championName,
      gamesPlayed: stats.gamesPlayed,
      winRate: ((stats.wins / stats.gamesPlayed) * 100).toFixed(1),
      avgKills: (stats.totalKills / stats.gamesPlayed).toFixed(1),
      avgDeaths: (stats.totalDeaths / stats.gamesPlayed).toFixed(1),
      avgAssists: (stats.totalAssists / stats.gamesPlayed).toFixed(1),
      kda: ((stats.totalKills + stats.totalAssists) / Math.max(1, stats.totalDeaths)).toFixed(2),
      avgCSPerMin: (stats.totalCS / stats.totalGameDuration).toFixed(1),
      avgCSPerGame: Math.round(stats.totalCS / stats.gamesPlayed),
      avgVisionScore: (stats.totalVisionScore / stats.gamesPlayed).toFixed(1)
    }))
    .sort((a, b) => b.gamesPlayed - a.gamesPlayed); // Sort by most played
}

function calculateRoleStats(matches: any[], puuid: string) {
  const roleStats: { [key: string]: RoleStats } = {
    Top: { games: 0, wins: 0, percentage: 0 },
    Jungle: { games: 0, wins: 0, percentage: 0 },
    Mid: { games: 0, wins: 0, percentage: 0 },
    ADC: { games: 0, wins: 0, percentage: 0 },
    Support: { games: 0, wins: 0, percentage: 0 }
  };

  // Filter for only ranked games (420 is Solo/Duo, 440 is Flex)
  const validMatches = matches.filter(match => 
    match && 
    match.info.gameDuration >= 300 && // Skip remakes
    (match.info.queueId === 420 || match.info.queueId === 440) // Only ranked games
  );

  validMatches.forEach(match => {
    const playerStats = match.info.participants.find(
      (p: any) => p.puuid === puuid
    );

    if (!playerStats) return;

    // Use teamPosition for more accurate role detection
    const role = determineRole(playerStats);
    if (role in roleStats) {
      roleStats[role].games++;
      roleStats[role].wins += playerStats.win ? 1 : 0;
    }
  });

  // Calculate percentages based only on ranked games
  const totalGames = validMatches.length;
  Object.keys(roleStats).forEach(role => {
    roleStats[role].percentage = (roleStats[role].games / totalGames) * 100;
  });

  return roleStats;
}

function createCoachingPrompt(rankedStats: any, championStats: any[], roleStats: any) {
  if (!rankedStats || championStats.length === 0) {
    return 'No ranked data available for analysis.';
  }

  const soloQueue = rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5');
  
  const rankedInfo = soloQueue ? `
Ranked Profile:
- Tier: ${soloQueue.tier} ${soloQueue.rank}
- LP: ${soloQueue.leaguePoints}
- Win Rate: ${((soloQueue.wins / (soloQueue.wins + soloQueue.losses)) * 100).toFixed(1)}%
- Total Games: ${soloQueue.wins + soloQueue.losses}` : 'No Solo Queue data available.';

  const roleSection = `
Role Distribution:
${Object.entries(roleStats)
  .filter(([_, stats]) => (stats as RoleStats).games > 0)
  .sort(([_, a], [__, b]) => (b as RoleStats).games - (a as RoleStats).games)
  .map(([role, stats]) => 
    `${role}: ${(stats as RoleStats).games} games (${(stats as RoleStats).percentage.toFixed(1)}% of games, ${(((stats as RoleStats).wins / (stats as RoleStats).games) * 100).toFixed(1)}% WR)`
  ).join('\n')}`;

  const championSection = championStats.length > 0 ? `
Champion Statistics (Ranked Season):
${championStats.map(champ => `
${champ.championName} (${champ.gamesPlayed} games):
- Win Rate: ${champ.winRate}%
- KDA: ${champ.avgKills}/${champ.avgDeaths}/${champ.avgAssists} (${champ.kda})
- CS/min: ${champ.avgCSPerMin}
- Vision Score: ${champ.avgVisionScore}`).join('\n')}` : '';

  return `As a League of Legends coach, analyze this player's ranked season performance: 
${rankedInfo}
${roleSection}
${championSection}

Analyze the provided statistics and provide 3 goals, each accompanied by 3 actionable suggestions for improvement.

To help you choose the goals, here are some rules in the following format:
- [player tendency]: [goal]

- The player is playing their main role in less than 80% of their games: Stick to Main Role
- The player has more than 5 games on a champion that is not in their top 3 most played champions: Stick to Main Champions
- The player has on average more than 5 deaths: Minimize Deaths
- The player has on average less than 7 CS/min: Improve CS/min
`;
}

async function getMatchDetailsWithRateLimit(matchIds: string[], region: string, apiKey: string) {
  const matchDetails = [];
  const batchSize = 20; // Process 20 requests at a time
  
  // Split matchIds into batches of 20
  for (let i = 0; i < matchIds.length; i += batchSize) {
    const batch = matchIds.slice(i, i + batchSize);
    
    // Process batch
    const batchResults = await Promise.all(
      batch.map(matchId => getMatchDetails(matchId, region, apiKey))
    );
    
    matchDetails.push(...batchResults);
    
    // If there are more batches to process, wait 1 second
    if (i + batchSize < matchIds.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return matchDetails;
}

function determineRole(playerStats: any): string {
  // Use teamPosition as primary indicator (most reliable for ranked games)
  if (playerStats.teamPosition) {
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

  return 'Unknown';
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

  if (!gameName || !tagLine) {
    return res.status(400).json({ error: 'Game name and tag line are required' });
  }

  if (!process.env.RIOT_API_KEY) {
    console.error('RIOT_API_KEY is not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Step 1: Get PUUID using Riot ID
    const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
    const accountResponse = await fetch(accountUrl, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      }
    });

    if (!accountResponse.ok) {
      throw new Error(`Account API Error: ${await accountResponse.text()}`);
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;

    // Step 2: Get summoner data using PUUID
    const regionalApi = `https://${region.toLowerCase()}.api.riotgames.com`;
    const summonerUrl = `${regionalApi}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    
    const summonerResponse = await fetch(summonerUrl, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      }
    });

    if (!summonerResponse.ok) {
      throw new Error(`Summoner API Error: ${await summonerResponse.text()}`);
    }

    const summonerData = await summonerResponse.json();

    // Step 3: Get ranked stats
    const rankedStats = await getRankedStats(summonerData.id, region, process.env.RIOT_API_KEY);

    // Step 4: Get recent matches
    const routingValue = REGION_ROUTING[region as string] || 'americas';
    const matchListUrl = `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&start=0&count=100`;
    
    const matchListResponse = await fetch(matchListUrl, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY
      }
    });

    if (!matchListResponse.ok) {
      throw new Error(`Match list API Error: ${await matchListResponse.text()}`);
    }

    const matchIds = await matchListResponse.json();

    // Step 5: Get match details with rate limiting
    const matchDetails = await getMatchDetailsWithRateLimit(matchIds, region, process.env.RIOT_API_KEY);

    // Step 6: Calculate stats
    const championStats = calculateChampionStats(
      matchDetails.filter(match => match !== null),
      puuid
    );

    const roleStats = calculateRoleStats(matchDetails.filter(match => match !== null), puuid);
    const mainRole = Object.entries(roleStats)
      .sort(([_, a], [__, b]) => b.games - a.games)[0];

    // Create coaching prompt
    const coachingPrompt = createCoachingPrompt(rankedStats, championStats, roleStats);

    res.status(200).json({
      account: accountData,
      summoner: summonerData,
      rankedStats,
      championStats,
      roleStats,
      mainRole: mainRole[0],  // Send just the role name
      coachingPrompt
    });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 