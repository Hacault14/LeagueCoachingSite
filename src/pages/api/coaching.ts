import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const systemPrompt = `You are an experienced League of Legends coach who will provide 3 clear goals, with actionable advice based on player statistics.

Analyze the provided statistics and provide 3 goals, each accompanied by 3 actionable suggestions for improvement.

Format your response exactly like this:

[Goal 1]
Goal 1
- Actionable suggestion 1
- Actionable suggestion 2
- (Optional) Actionable suggestion 3

[Goal 2]
Goal 2
- Actionable suggestion 1
- Actionable suggestion 2
- (Optional) Actionable suggestion 3

[Goal 3]
Goal 3
- Actionable suggestion 1
- Actionable suggestion 2
- (Optional) Actionable suggestion 3`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const advice = completion.choices[0].message.content
    console.log('GPT Response:', advice);

    res.status(200).json({ advice })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    res.status(500).json({ 
      error: 'Failed to generate coaching advice',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 