'use client';

import { useState, useEffect } from 'react';
import { getHistory, deleteFromHistory, PromptRun } from '../utils/localStorage';
import HistoryList from '../components/HistoryList';
import Link from 'next/link';

export default function HistoryPage() {
  const [runs, setRuns] = useState<PromptRun[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = getHistory();
    setRuns(historyData);
  };

  const handleDelete = (id: string) => {
    deleteFromHistory(id);
    loadHistory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Prompt History</h1>
            <p className="text-gray-500">
              {runs.length} {runs.length === 1 ? 'saved experiment' : 'saved experiments'}
            </p>
          </div>
          <Link 
            href="/" 
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-full transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Experiment
          </Link>
        </div>

        <HistoryList runs={runs} onDelete={handleDelete} />
      </div>
    </div>
  );
} 