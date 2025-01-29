# LeagueCoachingSite

An AI-powered League of Legends coaching platform that provides personalized insights and analysis for players looking to improve their gameplay.

## Features

- **AI Coaching Analysis**: Get personalized coaching insights based on your recent ranked games
- **Champion Statistics**: View detailed performance metrics for your most played champions
- **Role Analysis**: Understand your performance across different roles
- **Rank Tracking**: Track your ranked progression and performance
- **Visual Stats**: Beautiful visualization of your gameplay statistics

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Riot Games API key (get one from [Riot Developer Portal](https://developer.riotgames.com))
- An OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com))

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/LeagueCoachingSite.git
cd LeagueCoachingSite
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
RIOT_API_KEY=your-riot-api-key
OPENAI_API_KEY=your-openai-api-key
```

4. Start the development server:
```bash
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable React components
│   ├── pages/       # Next.js pages and API routes
│   ├── styles/      # Global styles and theme
│   └── lib/         # Utility functions and helpers
└── ...config files
```

## Technologies Used

- **Frontend**: Next.js, TypeScript, Styled Components
- **APIs**: Riot Games API, OpenAI API
- **Styling**: Styled Components, Framer Motion
- **State Management**: React Hooks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Riot Games for their API
- OpenAI for their GPT models
- Next.js team for the amazing framework
