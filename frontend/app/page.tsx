'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { saveToHistory } from './utils/localStorage';
import PromptForm from './components/PromptForm';
import ResultsGrid from './components/ResultsGrid';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);

  const generateCombinations = (parameters: any) => {
    const combinations: any[] = [];
    const temps = parameters.temperature || [0.7];
    const tokens = parameters.max_tokens || [150];
    const freqs = parameters.frequency_penalty || [0];
    const presence = parameters.presence_penalty || [0];

    for (const temp of temps) {
      for (const token of tokens) {
        for (const freq of freqs) {
          for (const pres of presence) {
            combinations.push({
              temperature: temp,
              max_tokens: token,
              frequency_penalty: freq,
              presence_penalty: pres
            });
          }
        }
      }
    }

    return combinations;
  };

  const callOpenAI = async (
    model: string, 
    systemPrompt: string, 
    userPrompt: string, 
    parameters: any
  ) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: systemPrompt || 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          ...parameters
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      return {
        output: data.choices[0]?.message?.content || '',
        parameters,
        usage: data.usage
      };
    } catch (err: any) {
      console.error('OpenAI API error:', err);
      return {
        output: `Error: ${err.message}`,
        parameters,
        error: true
      };
    }
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { systemPrompt, userPrompt, model, parameters } = formData;
      const paramCombinations = generateCombinations(parameters);
      
      // Execute API calls in parallel
      const apiResults = await Promise.all(
        paramCombinations.map(params => 
          callOpenAI(model, systemPrompt, userPrompt, params)
        )
      );

      setResults({
        success: true,
        results: apiResults
      });

      // Save to history
      const promptRun = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        systemPrompt,
        userPrompt,
        model,
        parameters: {
          temperature: parameters.temperature,
          max_tokens: parameters.max_tokens,
          frequency_penalty: parameters.frequency_penalty,
          presence_penalty: parameters.presence_penalty,
        },
        results: apiResults
      };
      
      saveToHistory(promptRun);
      return apiResults;
    } catch (err: any) {
      console.error('Error:', err);
      setError(`Failed to generate response: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Interactive Prompt Playground</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PromptForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
        <div>
          <ResultsGrid response={results} />
        </div>
      </div>
    </main>
  );
}
