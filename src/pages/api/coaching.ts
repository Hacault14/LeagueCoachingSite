import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const systemPrompt = `You are an experienced League of Legends coach who provides clear, actionable advice based on player statistics.
Format your response exactly with these four sections using these exact headers:

Strengths:
[List the player's key strengths in bullet points]

Weaknesses:
[List the main areas where the player needs improvement in bullet points]

Improvements:
[Provide specific, actionable advice for improvement in bullet points]

Champion Recommendations:
[Suggest 2-3 champions that would suit their playstyle and explain why in bullet points]

Keep each section concise and focused on actionable insights.`

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
      model: "gpt-4o",
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

    res.status(200).json({ advice })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    res.status(500).json({ 
      error: 'Failed to generate coaching advice',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 