'use client';

import { BatchPromptResponse } from '../types/prompt';

interface ResultsGridProps {
  response?: BatchPromptResponse | null;
}

export default function ResultsGrid({ response }: ResultsGridProps) {
  if (!response || !response.results || response.results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        Run a prompt to see results here
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Results</h2>
      <div className="grid gap-4">
        {response.results.map((result, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                T: {result.parameters.temperature}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                M: {result.parameters.max_tokens}
              </span>
              {result.parameters.frequency_penalty > 0 && (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                  F: {result.parameters.frequency_penalty}
                </span>
              )}
              {result.parameters.presence_penalty > 0 && (
                <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs">
                  P: {result.parameters.presence_penalty}
                </span>
              )}
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">
                {result.error ? (
                  <span className="text-red-600">{result.error}</span>
                ) : (
                  result.response || result.output || 'No output available'
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 