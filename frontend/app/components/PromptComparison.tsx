'use client';

import { useMemo } from 'react';
import { diffWords } from 'diff';
import { PromptRun } from '../types/prompt';

interface PromptComparisonProps {
  sessions: [PromptRun, PromptRun];
  onClose: () => void;
}

export default function PromptComparison({ sessions, onClose }: PromptComparisonProps) {
  const [session1, session2] = sessions;

  const formatParameters = (params: PromptRun['parameters']) => {
    return `T: ${params.temperature} | MT: ${params.max_tokens} | FP: ${params.frequency_penalty} | PP: ${params.presence_penalty}`;
  };

  const diffResult = useMemo(() => {
    const text1 = session1.results[0]?.response || '';
    const text2 = session2.results[0]?.response || '';
    return diffWords(text1, text2);
  }, [session1, session2]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Session Comparison</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">System Prompt:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{session1.systemPrompt}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{session2.systemPrompt}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">User Prompt:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{session1.userPrompt}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Parameters:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{formatParameters(session1.parameters)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{formatParameters(session2.parameters)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Response Comparison:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="prose max-w-none">
                  {diffResult.map((part, index) => (
                    <span
                      key={index}
                      className={
                        part.added
                          ? 'bg-green-100'
                          : part.removed
                          ? 'bg-red-100'
                          : ''
                      }
                    >
                      {part.value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 