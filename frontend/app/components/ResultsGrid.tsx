'use client';

import { useState } from 'react';

interface ResultsGridProps {
  response?: {
    results: Array<{
      output: string;
      parameters: {
        temperature: number;
        maxTokens: number;
        presencePenalty: number;
        frequencyPenalty: number;
      };
    }>;
  };
}

export default function ResultsGrid({ response }: ResultsGridProps) {
  const [selectedResult, setSelectedResult] = useState<number | null>(null);

  if (!response || !response.results || response.results.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        Results will appear here after generation
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Results</h2>
      <div className="grid gap-6">
        {response.results.map((result, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-blue-300 transition-all"
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => setSelectedResult(selectedResult === index ? null : index)}
            >
              <div className="flex space-x-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  T: {result.parameters.temperature}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  M: {result.parameters.maxTokens}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  P: {result.parameters.presencePenalty}
                </span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  F: {result.parameters.frequencyPenalty}
                </span>
              </div>
              <div className={selectedResult === index ? '' : 'line-clamp-3'}>
                <p className="text-gray-700 whitespace-pre-wrap">{result.output}</p>
              </div>
              {result.output.length > 150 && selectedResult !== index && (
                <button className="text-blue-600 text-sm mt-2">Show more</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 