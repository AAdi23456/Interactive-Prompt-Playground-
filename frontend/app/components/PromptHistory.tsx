import React, { memo, useCallback, useMemo } from 'react';
import { PromptHistory as PromptHistoryType } from '../types/prompt';

interface PromptHistoryProps {
  history: PromptHistoryType;
  onDelete: (id: string) => void;
  onCopy?: () => void;
  onCompare?: () => void;
}

const PromptHistory = memo(({ history, onDelete, onCopy, onCompare }: PromptHistoryProps) => {
  // Guard against undefined history
  if (!history || !history.id || !history.request) {
    console.warn('PromptHistory - Invalid history object:', history);
    return null;
  }

  const formattedDate = useMemo(() => 
    history.timestamp ? new Date(history.timestamp).toLocaleString() : 'No date'
  , [history.timestamp]);
  
  // Calculate total parameter combinations with null checks
  const totalCombinations = useMemo(() => 
    ((history.request?.parameterSets?.temperatures?.length || 1) *
    (history.request?.parameterSets?.maxTokens?.length || 1) *
    (history.request?.parameterSets?.frequencyPenalties?.length || 1) *
    (history.request?.parameterSets?.presencePenalties?.length || 1)) || 0
  , [history.request?.parameterSets]);

  const handleDelete = useCallback(() => {
    onDelete(history.id);
  }, [history.id, onDelete]);

  const responsePreview = useMemo(() => {
    if (!history.response?.results?.[0]) return 'No response';
    const firstResult = history.response.results[0];
    return firstResult.error ? `Error: ${firstResult.error}` : firstResult.response || 'No content';
  }, [history.response]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Prompt {history.id}</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex space-x-2">
          {onCopy && (
            <button
              onClick={onCopy}
              className="text-blue-600 hover:text-blue-800"
              title="Copy prompt"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          )}
          {onCompare && (
            <button
              onClick={onCompare}
              className="text-green-600 hover:text-green-800"
              title="Compare results"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete prompt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-gray-700">
          <span className="font-medium">Model:</span> {history.request.model}
        </div>
        <div className="text-gray-700">
          <span className="font-medium">System Prompt:</span>
          <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
            {history.request.systemPrompt || 'None'}
          </div>
        </div>
        <div className="text-gray-700">
          <span className="font-medium">User Prompt:</span>
          <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
            {history.request.userPrompt}
          </div>
        </div>
        <div className="text-gray-700">
          <span className="font-medium">Parameters:</span>
          <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
            {totalCombinations} combinations
          </div>
        </div>
        <div className="text-gray-700">
          <span className="font-medium">Response Preview:</span>
          <div className="mt-1 text-sm bg-gray-50 p-2 rounded whitespace-pre-wrap">
            {responsePreview}
          </div>
        </div>
      </div>
    </div>
  );
});

PromptHistory.displayName = 'PromptHistory';

export default PromptHistory; 