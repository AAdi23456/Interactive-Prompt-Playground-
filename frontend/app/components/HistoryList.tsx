'use client';

import { useState } from 'react';
import { PromptRun } from '../utils/localStorage';

interface HistoryListProps {
  runs: PromptRun[];
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  selectedIds?: string[];
}

export default function HistoryList({ runs, onDelete, onSelect, selectedIds = [] }: HistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleItemClick = (id: string) => {
    if (onSelect) {
      onSelect(id);
    } else {
      setExpandedId(expandedId === id ? null : id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {runs.map((run) => (
        <div
          key={run.id}
          className={`bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 ${
            expandedId === run.id ? 'ring-2 ring-purple-200' : ''
          }`}
        >
          <div 
            className="p-5 cursor-pointer"
            onClick={() => setExpandedId(expandedId === run.id ? null : run.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-400">{formatDate(run.timestamp)}</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                {run.model}
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">System Prompt</h3>
                <p className="text-sm text-gray-700 line-clamp-2">{run.systemPrompt || 'None'}</p>
              </div>
              
              <div>
                <h3 className="text-xs font-medium text-gray-500 mb-1">User Prompt</h3>
                <p className="text-sm text-gray-700 line-clamp-2">{run.userPrompt}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                T: {run.parameters.temperature}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                M: {run.parameters.max_tokens}
              </span>
              {run.parameters.frequency_penalty > 0 && (
                <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                  F: {run.parameters.frequency_penalty}
                </span>
              )}
              {run.parameters.presence_penalty > 0 && (
                <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs">
                  P: {run.parameters.presence_penalty}
                </span>
              )}
            </div>
          </div>

          {expandedId === run.id && (
            <div className="border-t border-gray-100 p-5 bg-white">
              <h3 className="text-xs font-medium text-gray-500 mb-2">Results</h3>
              <div className="space-y-3">
                {run.results.map((result: any, index: number) => (
                  <div key={index} className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {typeof result === 'string' ? result : result.output || 'No output available'}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(run.id);
                  }}
                  className="px-4 py-2 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
                >
                  Delete Run
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {runs.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No History Available</div>
          <p className="text-gray-500 text-sm">Generate some prompts to see your history here!</p>
        </div>
      )}
    </div>
  );
} 