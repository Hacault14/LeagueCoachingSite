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
  if (!matches || matches.length === 0) {
    console.warn('No matches provided for champion stats calculation');
    return [];
  }

  const championStats: { [key: string]: ChampionStats } = {};
  let validMatchesCount = 0;

  matches.forEach((match, index) => {
    if (!match || !match.info) {
      console.warn(`Invalid match data at index ${index}`);
      return;
    }

    // Skip remade games (games shorter than 5 minutes)
    if (match.info.gameDuration < 300) {
      console.log(`Skipping remade game ${match.info.gameId}`);
      return;
    }
    
    // Only process ranked games
    if (match.info.queueId !== 420 && match.info.queueId !== 440) {
      console.log(`Skipping non-ranked game ${match.info.gameId} (Queue: ${match.info.queueId})`);
      return;
    }
    
    const playerStats = match.info.participants.find(
      (p: any) => p.puuid === puuid
    );

    if (!playerStats) {
      console.warn(`Player not found in match ${match.info.gameId}`);
      return;
    }

    validMatchesCount++;
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
    championStats[championName].totalKills += playerStats.kills || 0;
    championStats[championName].totalDeaths += playerStats.deaths || 0;
    championStats[championName].totalAssists += playerStats.assists || 0;
    championStats[championName].totalCS += (playerStats.totalMinionsKilled || 0) + (playerStats.neutralMinionsKilled || 0);
    championStats[championName].totalGameDuration += gameDurationMinutes;
    championStats[championName].totalVisionScore += playerStats.visionScore || 0;
  });

  console.log(`Processed ${validMatchesCount} valid ranked matches out of ${matches.length} total matches`);

  if (validMatchesCount === 0) {
    console.warn('No valid ranked matches found for champion stats calculation');
    return [];
  }

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

async function getAccountData(gameName: string, tagLine: string, apiKey: string) {
  const response = await fetch(
    `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    {
      headers: {
        'X-Riot-Token': apiKey
      }
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch account data:', await response.text());
    return null;
  }

  return response.json();
}

async function getSummonerData(puuid: string, region: string, apiKey: string) {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
    {
      headers: {
        'X-Riot-Token': apiKey
      }
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch summoner data:', await response.text());
    return null;
  }

  return response.json();
}

async function getMatchIds(puuid: string, region: string, apiKey: string) {
  const routingValue = REGION_ROUTING[region] || 'americas';
  
  // First get all recent matches without queue filter
  const response = await fetch(
    `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=100`,
    {
      headers: {
        'X-Riot-Token': apiKey
      }
    }
  );

  if (!response.ok) {
    console.error('Failed to fetch match IDs:', await response.text());
    return null;
  }

  const allMatches = await response.json();
  console.log(`Found ${allMatches.length} total matches`);
  
  // Get details for the first few matches to determine their queue types
  const firstBatch = allMatches.slice(0, 20); // Check first 20 matches
  const matchDetails = await Promise.all(
    firstBatch.map((matchId: string) => getMatchDetails(matchId, region, apiKey))
  );

  // Filter for ranked games (queue IDs 420 and 440)
  const rankedMatches = matchDetails
    .filter(match => match !== null && (match.info.queueId === 420 || match.info.queueId === 440))
    .map(match => match.metadata.matchId);

  console.log(`Found ${rankedMatches.length} ranked matches out of ${firstBatch.length} checked matches`);
  
  return rankedMatches;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
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
      console.log(`Fetching data for ${gameName}#${tagLine} in region ${region}`);
      
      // Step 1: Get PUUID using Riot ID
      const accountData = await getAccountData(gameName, tagLine, process.env.RIOT_API_KEY);
      if (!accountData) {
        console.error('Account not found for:', gameName, tagLine);
        return res.status(404).json({ error: 'Account not found' });
      }
      console.log('Account found:', accountData.puuid);

      // Step 2: Get summoner data using PUUID
      const summonerData = await getSummonerData(accountData.puuid, region, process.env.RIOT_API_KEY);
      if (!summonerData) {
        console.error('Summoner data not found for PUUID:', accountData.puuid);
        return res.status(404).json({ error: 'Summoner data not found' });
      }
      console.log('Summoner data found:', summonerData.id);

      // Step 3: Get ranked stats
      const rankedStats = await getRankedStats(summonerData.id, region, process.env.RIOT_API_KEY);
      if (!rankedStats) {
        console.warn('No ranked stats found for summoner:', summonerData.id);
      } else {
        console.log('Found ranked stats:', rankedStats.length, 'queues');
      }

      // Step 4: Get match IDs
      const matchIds = await getMatchIds(accountData.puuid, region, process.env.RIOT_API_KEY);
      if (!matchIds || matchIds.length === 0) {
        console.error('No matches found for PUUID:', accountData.puuid);
        return res.status(404).json({ 
          error: 'No ranked matches found',
          details: 'The player has no recent ranked games in Solo Queue or Flex Queue'
        });
      }
      console.log(`Found ${matchIds.length} total matches`);

      // Step 5: Get match details with rate limiting
      console.log(`Fetching details for ${matchIds.length} matches...`);
      const matchDetails = await getMatchDetailsWithRateLimit(matchIds.slice(0, 20), region, process.env.RIOT_API_KEY);
      const validMatches = matchDetails.filter(match => match !== null);
      
      if (validMatches.length === 0) {
        console.error('No valid matches found after filtering');
        return res.status(404).json({ 
          error: 'No valid matches found',
          details: 'Could not retrieve details for any of the matches'
        });
      }
      console.log(`Successfully fetched ${validMatches.length} valid matches out of ${matchIds.length} total matches`);

      // Step 6: Calculate stats
      const championStats = calculateChampionStats(validMatches, accountData.puuid);
      const roleStats = calculateRoleStats(validMatches, accountData.puuid);
      const mainRole = Object.entries(roleStats)
        .sort(([_, a], [__, b]) => (b as RoleStats).games - (a as RoleStats).games)
        .map(([role, stats]) => ({
          role,
          stats
        }))[0];

      // Step 7: Create coaching prompt
      const coachingPrompt = createCoachingPrompt(rankedStats, championStats, roleStats);

      // Return all data
      res.status(200).json({
        account: accountData,
        summoner: summonerData,
        rankedStats,
        championStats,
        roleStats,
        mainRole,
        coachingPrompt,
        debug: {
          totalMatches: matchIds.length,
          validMatches: validMatches.length,
          processedChampions: championStats.length,
          region: region,
          routingValue: REGION_ROUTING[region] || 'americas'
        }
      });

    } catch (error: any) {
      console.error('Detailed error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error',
        path: error?.response?.url || 'Unknown path'
      });
    }
  } catch (error: any) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
  }
} 