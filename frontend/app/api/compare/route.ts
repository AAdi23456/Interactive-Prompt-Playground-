import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import { BatchPromptRequest, BatchPromptResponse, PromptParameters, PromptResult } from '../../types/prompt';

// Configuration for OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Backend API URL - modify this if your backend is running on a different port
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:5000/api';

function generateParameterCombinations(parameterSets: BatchPromptRequest['parameterSets']): PromptParameters[] {
  const combinations: PromptParameters[] = [];
  
  for (const temperature of parameterSets.temperatures) {
    for (const max_tokens of parameterSets.max_tokens) {
      for (const frequency_penalty of parameterSets.frequency_penalties) {
        for (const presence_penalty of parameterSets.presence_penalties) {
          combinations.push({
            temperature,
            max_tokens,
            frequency_penalty,
            presence_penalty,
          });
        }
      }
    }
  }
  
  return combinations;
}

function analyzeText(text: string): { wordCount: number; sentiment: 'positive' | 'negative' | 'neutral' } {
  const words = text.trim().split(/\s+/).length;
  
  // Simple sentiment analysis based on positive and negative word counts
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'happy', 'joy'];
  const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'sad', 'angry', 'hate'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.reduce((count, word) => count + (lowerText.match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0), 0);
  const negativeCount = negativeWords.reduce((count, word) => count + (lowerText.match(new RegExp(`\\b${word}\\b`, 'g'))?.length || 0), 0);
  
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  return {
    wordCount: words,
    sentiment,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { systemPrompt, userPrompt, model, parameters } = body;

    // Generate all parameter combinations
    const combinations: PromptParameters[] = [];
    const temperatures = Array.isArray(parameters.temperature) ? parameters.temperature : [parameters.temperature];
    const tokens = Array.isArray(parameters.max_tokens) ? parameters.max_tokens : [parameters.max_tokens];
    const freqPenalties = Array.isArray(parameters.frequency_penalty) ? parameters.frequency_penalty : [parameters.frequency_penalty];
    const presPenalties = Array.isArray(parameters.presence_penalty) ? parameters.presence_penalty : [parameters.presence_penalty];

    for (const temperature of temperatures) {
      for (const max_tokens of tokens) {
        for (const frequency_penalty of freqPenalties) {
          for (const presence_penalty of presPenalties) {
            combinations.push({
              temperature,
              max_tokens,
              frequency_penalty,
              presence_penalty,
            });
          }
        }
      }
    }

    // Call OpenAI API for each combination
    const results = await Promise.all(
      combinations.map(async (params) => {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
              ],
              temperature: params.temperature,
              max_tokens: params.max_tokens,
              frequency_penalty: params.frequency_penalty,
              presence_penalty: params.presence_penalty,
            }),
          });

          const data = await response.json();
          return {
            parameters: params,
            response: data.choices[0].message.content,
          };
        } catch (error) {
          console.error('Error calling OpenAI:', error);
          return {
            parameters: params,
            error: 'Failed to generate response',
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 