# Interactive Prompt Playground

An educational tool for exploring and understanding OpenAI model behaviors through interactive parameter manipulation.

## Project Structure

- `frontend/` - Next.js application with TypeScript and TailwindCSS
- `backend/` - NestJS application with OpenAI integration

## Features

- Interactive control of OpenAI parameters
- Real-time model response visualization
- Support for multiple GPT models
- Educational insights on parameter effects

## Getting Started

### Backend Setup
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Create `.env` file with the following content:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_api_key_here

   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```
4. Replace `your_api_key_here` with your actual OpenAI API key
5. Run development server: `npm run start:dev`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Development Status

- ✅ Phase 1: Project Setup
- ✅ Phase 2: Prompt Engine Core
- ✅ Phase 3: Parameter Control System
- 🔄 Phase 4-7: In Progress

## Security Notes

- Never commit your API keys to version control
- Always use environment variables for sensitive data
- Keep your API keys secure and rotate them regularly

## Documentation

Detailed documentation for each component and feature will be added as development progresses.