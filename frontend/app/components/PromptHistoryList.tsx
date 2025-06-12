'use client';

import { useState, useEffect } from 'react';
import { PromptRun } from '../types/prompt';
import PromptHistory from './PromptHistory';
import { getHistory, deleteFromHistory } from '../utils/localStorage';

export default function PromptHistoryList() {
  const [history, setHistory] = useState<PromptRun[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = getHistory();
    setHistory(historyData);
  };

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    loadHistory();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Prompt History</h2>
        {history.length > 0 && (
          <button 
            onClick={() => {
              if (confirm('Are you sure you want to clear all history?')) {
                localStorage.removeItem('prompt_history');
                loadHistory();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      <PromptHistory history={history} onDelete={handleDelete} />
    </div>
  );
} 