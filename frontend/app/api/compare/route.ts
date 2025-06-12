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
    for (const maxTokens of parameterSets.maxTokens) {
      for (const frequencyPenalty of parameterSets.frequencyPenalties) {
        for (const presencePenalty of parameterSets.presencePenalties) {
          combinations.push({
            temperature,
            maxTokens,
            frequencyPenalty,
            presencePenalty,
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
    const body: BatchPromptRequest = await request.json();
    const { model, systemPrompt, userPrompt, parameterSets } = body;
    
    // Try to use the backend API if available
    try {
      const backendResponse = await fetch(`${BACKEND_API_URL}/prompt/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      }
      // If backend is not available, fall back to using OpenAI directly
      console.log("Backend not available, using OpenAI directly");
    } catch (backendError) {
      console.error("Error connecting to backend:", backendError);
      // Proceed with direct OpenAI connection
    }
    
    // Fallback to direct OpenAI connection
    const combinations = generateParameterCombinations(parameterSets);
    const results: PromptResult[] = [];
    
    // Run API calls in parallel with a concurrency limit
    const CONCURRENCY_LIMIT = 3;
    for (let i = 0; i < combinations.length; i += CONCURRENCY_LIMIT) {
      const batch = combinations.slice(i, i + CONCURRENCY_LIMIT);
      const promises = batch.map(async (parameters) => {
        const startTime = Date.now();
        try {
          const completion = await openai.createChatCompletion({
            model,
            messages: [
              ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
              { role: 'user' as const, content: userPrompt }
            ],
            temperature: parameters.temperature,
            max_tokens: parameters.maxTokens,
            frequency_penalty: parameters.frequencyPenalty,
            presence_penalty: parameters.presencePenalty,
          });
          
          const response = completion.data.choices[0]?.message?.content || '';
          const analysis = analyzeText(response);
          
          return {
            parameters,
            response,
            usage: completion.data.usage,
            analysis,
            elapsedTimeMs: Date.now() - startTime,
          };
        } catch (error: any) {
          console.error('OpenAI API error:', error);
          return {
            parameters,
            response: '',
            error: error.message || 'Failed to generate response',
            elapsedTimeMs: Date.now() - startTime,
          };
        }
      });
      
      const batchResults = await Promise.all(promises);
      results.push(...batchResults);
    }
    
    const response: BatchPromptResponse = {
      success: true,
      results,
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in compare route:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
      results: [],
    } as BatchPromptResponse, { status: 500 });
  }
} 