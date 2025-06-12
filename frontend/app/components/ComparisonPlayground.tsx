'use client';

import { useState } from 'react';
import { BatchPromptResponse } from '../types/prompt';
import PromptForm from './PromptForm';
import ResultsGrid from './ResultsGrid';

export default function ComparisonPlayground() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState<BatchPromptResponse | null>(null);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const { systemPrompt, userPrompt, model, parameters } = formData;
      
      // Convert single values to arrays for comparison
      const parameterSets = {
        temperatures: Array.isArray(parameters.temperature) ? parameters.temperature : [parameters.temperature],
        max_tokens: Array.isArray(parameters.max_tokens) ? parameters.max_tokens : [parameters.max_tokens],
        frequency_penalties: Array.isArray(parameters.frequency_penalty) ? parameters.frequency_penalty : [parameters.frequency_penalty],
        presence_penalties: Array.isArray(parameters.presence_penalty) ? parameters.presence_penalty : [parameters.presence_penalty],
      };

      const requestBody = {
        model,
        systemPrompt,
        userPrompt,
        parameterSets
      };

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentResponse(data);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to compare prompts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PromptForm onSubmit={handleSubmit} isLoading={loading} />
        </div>
        <div>
          <ResultsGrid response={currentResponse} />
        </div>
      </div>
    </div>
  );
} 