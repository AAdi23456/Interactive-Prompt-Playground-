import React, { useState, useEffect, useCallback } from 'react';
import { PromptHistory as PromptHistoryType } from '../types/prompt';
import PromptHistory from './PromptHistory';
import { usePromptHistory } from '../hooks/usePromptHistory';

interface PromptHistoryListProps {
  onLoadHistory: (history: PromptHistoryType) => void;
}

const PromptHistoryList: React.FC<PromptHistoryListProps> = ({ onLoadHistory }) => {
  const { histories, deleteHistory, clearHistories, version } = usePromptHistory();
  const [selectedHistories, setSelectedHistories] = useState<Set<string>>(new Set());
  const [isComparing, setIsComparing] = useState(false);
  const [localHistories, setLocalHistories] = useState<PromptHistoryType[]>([]);

  // Update local state when histories or version changes
  useEffect(() => {
    console.log('Histories or version updated:', { histories, version });
    setLocalHistories([...histories]); // Create new array to force update
  }, [histories, version]);

  const handleSelect = useCallback((id: string) => {
    setSelectedHistories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < 3) { // Limit to 3 histories for comparison
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleCompare = useCallback(() => {
    if (selectedHistories.size > 1) {
      setIsComparing(true);
    }
  }, [selectedHistories.size]);

  const handleCopy = useCallback((history: PromptHistoryType) => {
    console.log('Copying history:', history);
    onLoadHistory(history);
  }, [onLoadHistory]);

  const handleDelete = useCallback((id: string) => {
    console.log('Deleting history:', id);
    deleteHistory(id);
    setSelectedHistories(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [deleteHistory]);

  const handleClearAll = useCallback(() => {
    clearHistories();
    setSelectedHistories(new Set());
    setIsComparing(false);
  }, [clearHistories]);

  const getResponseText = useCallback((history: PromptHistoryType) => {
    if (!history.response || !history.response.results) {
      return 'No response';
    }
    return history.response.results
      .map(result => {
        if (result.error) {
          return `Error: ${result.error}`;
        }
        return result.response || 'No content';
      })
      .join('\n\n');
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Prompt History ({localHistories.length})</h2>
        <div className="flex gap-2">
          {selectedHistories.size > 1 && (
            <button
              onClick={handleCompare}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Compare ({selectedHistories.size})
            </button>
          )}
          {localHistories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {isComparing && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Comparison View</h3>
            <button
              onClick={() => setIsComparing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from(selectedHistories).map(id => {
              const history = localHistories.find(h => h.id === id);
              return history ? (
                <div key={`${id}-${version}`} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-medium mb-2">Prompt {history.id}</h4>
                  <div>
                    <div>
                      <span className="font-medium">Model:</span> {history.request.model}
                    </div>
                    <div>
                      <span className="font-medium">System Prompt:</span>
                      <p className="mt-1 bg-gray-50 p-2 rounded">
                        {history.request.systemPrompt || 'None'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">User Prompt:</span>
                      <p className="mt-1 bg-gray-50 p-2 rounded">
                        {history.request.userPrompt}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Response:</span>
                      <p className="mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                        {getResponseText(history)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Parameters:</span>
                      <div className="mt-1 space-y-1">
                        {history.response.results.map((result, idx) => (
                          <div key={idx} className="bg-gray-50 p-2 rounded text-xs">
                            <div>Temperature: {result.parameters.temperature}</div>
                            <div>Max Tokens: {result.parameters.maxTokens}</div>
                            <div>Frequency Penalty: {result.parameters.frequencyPenalty}</div>
                            <div>Presence Penalty: {result.parameters.presencePenalty}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {localHistories.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No prompt history yet. Run some prompts to see them here.
          </div>
        ) : (
          localHistories.map(history => (
            <div key={`${history.id}-${version}`} className="relative">
              <div className="absolute top-2 right-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedHistories.has(history.id)}
                  onChange={() => handleSelect(history.id)}
                  className="h-5 w-5 text-blue-600"
                />
              </div>
              <PromptHistory
                history={history}
                onDelete={handleDelete}
                onCopy={() => handleCopy(history)}
                onCompare={() => handleSelect(history.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(PromptHistoryList); 