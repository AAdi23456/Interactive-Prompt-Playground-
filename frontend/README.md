# Interactive Prompt Playground

A tool for exploring how different OpenAI parameters affect model responses.

## Features

- Input system and user prompts
- Select multiple values for OpenAI parameters:
  - Temperature
  - Max Tokens
  - Frequency Penalty
  - Presence Penalty
- Run all parameter combinations in a single request
- View results in a responsive grid
- Save sessions to history for later reference
- Reload or delete past sessions
- Compare two different sessions side by side with text differences highlighted

## Getting Started

### Prerequisites

- Node.js 16+
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/interactive-prompt-playground.git
cd interactive-prompt-playground
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
```

3. Create a `.env.local` file in the frontend directory with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a system prompt (optional) and user prompt
2. Select parameter values using the sliders
3. Click "Run Comparison" to generate responses for all parameter combinations
4. View the results in the grid
5. Switch to the History tab to view previous sessions
6. Click the reload icon to load a previous session

### Comparing Sessions

1. Go to the History tab
2. Select two sessions you want to compare by checking the checkboxes
3. Click the "Compare Selected" button
4. View the side-by-side comparison with differences highlighted
5. Close the comparison modal when done

## Testing

Run the tests with:
```bash
npm test
```

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [OpenAI API](https://platform.openai.com/) - For generating text responses

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
