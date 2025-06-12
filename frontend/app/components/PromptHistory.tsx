'use client';

import { useState } from 'react';
import { PromptRun } from '../types/prompt';

interface PromptHistoryProps {
  history: PromptRun[];
  onDelete?: (id: string) => void;
}

export default function PromptHistory({ history, onDelete }: PromptHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        No history yet. Run some prompts to see them here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Prompt History</h2>
      <div className="grid gap-4">
        {history.map((run) => (
          <div
            key={run.id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden ${
              expandedId === run.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === run.id ? null : run.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-500">{formatDate(run.timestamp)}</div>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(run.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">System Prompt</h3>
                  <p className="text-sm text-gray-600">{run.systemPrompt || 'None'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">User Prompt</h3>
                  <p className="text-sm text-gray-600">{run.userPrompt}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                    T: {run.parameters.temperature}
                  </span>
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                    M: {run.parameters.max_tokens}
                  </span>
                  {run.parameters.frequency_penalty > 0 && (
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      F: {run.parameters.frequency_penalty}
                    </span>
                  )}
                  {run.parameters.presence_penalty > 0 && (
                    <span className="px-2 py-1 bg-pink-50 text-pink-700 rounded-full text-xs">
                      P: {run.parameters.presence_penalty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {expandedId === run.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Results</h3>
                <div className="space-y-4">
                  {run.results.map((result, index) => (
                    <div key={index} className="bg-white rounded p-3">
                      {result.error ? (
                        <p className="text-red-600 text-sm">{result.error}</p>
                      ) : (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {result.response || result.output}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 