'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getHistory, PromptRun } from '../utils/localStorage';
import Link from 'next/link';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const [runs, setRuns] = useState<PromptRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = searchParams?.get('ids')?.split(',') || [];
    
    if (ids.length !== 2) {
      setError('Invalid comparison: exactly two runs must be selected');
      setLoading(false);
      return;
    }

    const historyData = getHistory();
    const selectedRuns = historyData.filter(run => ids.includes(run.id));
    
    if (selectedRuns.length !== 2) {
      setError('One or both of the selected runs could not be found');
      setLoading(false);
      return;
    }
    
    if (selectedRuns[0].userPrompt !== selectedRuns[1].userPrompt) {
      setError('Cannot compare runs with different prompts');
      setLoading(false);
      return;
    }
    
    setRuns(selectedRuns);
    setLoading(false);
  }, [searchParams]);

  // Helper to highlight parameter differences
  const isDifferent = (key: string, index: number) => {
    if (runs.length !== 2) return false;
    
    const run1 = runs[0].parameters;
    const run2 = runs[1].parameters;
    
    // @ts-ignore - dynamic access
    return run1[key] !== run2[key];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <Link href="/history" className="text-blue-600 hover:text-blue-800">
          Back to History
        </Link>
      </div>
    );
  }

  if (runs.length !== 2) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          Please select two runs to compare
        </div>
        <Link href="/history" className="text-blue-600 hover:text-blue-800">
          Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Compare Runs</h1>
        <Link href="/history" className="text-blue-600 hover:text-blue-800">
          Back to History
        </Link>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Prompt</h2>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-1">System Prompt</h3>
          <p className="p-3 bg-gray-50 rounded border border-gray-200">
            {runs[0].systemPrompt || 'None'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">User Prompt</h3>
          <p className="p-3 bg-gray-50 rounded border border-gray-200">
            {runs[0].userPrompt}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Parameter Comparison</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-1 font-medium text-gray-700">Parameter</div>
          <div className="col-span-1 font-medium text-gray-700">Run 1</div>
          <div className="col-span-1 font-medium text-gray-700">Run 2</div>
          
          <div className="col-span-1">Model</div>
          <div className={`col-span-1 ${runs[0].model !== runs[1].model ? 'bg-yellow-50' : ''}`}>
            {runs[0].model}
          </div>
          <div className={`col-span-1 ${runs[0].model !== runs[1].model ? 'bg-yellow-50' : ''}`}>
            {runs[1].model}
          </div>
          
          <div className="col-span-1">Temperature</div>
          <div className={`col-span-1 ${isDifferent('temperature', 0) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[0].parameters.temperature) 
              ? runs[0].parameters.temperature.join(', ') 
              : runs[0].parameters.temperature}
          </div>
          <div className={`col-span-1 ${isDifferent('temperature', 1) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[1].parameters.temperature) 
              ? runs[1].parameters.temperature.join(', ') 
              : runs[1].parameters.temperature}
          </div>
          
          <div className="col-span-1">Max Tokens</div>
          <div className={`col-span-1 ${isDifferent('max_tokens', 0) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[0].parameters.max_tokens) 
              ? runs[0].parameters.max_tokens.join(', ') 
              : runs[0].parameters.max_tokens}
          </div>
          <div className={`col-span-1 ${isDifferent('max_tokens', 1) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[1].parameters.max_tokens) 
              ? runs[1].parameters.max_tokens.join(', ') 
              : runs[1].parameters.max_tokens}
          </div>
          
          <div className="col-span-1">Frequency Penalty</div>
          <div className={`col-span-1 ${isDifferent('frequency_penalty', 0) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[0].parameters.frequency_penalty) 
              ? runs[0].parameters.frequency_penalty.join(', ') 
              : runs[0].parameters.frequency_penalty}
          </div>
          <div className={`col-span-1 ${isDifferent('frequency_penalty', 1) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[1].parameters.frequency_penalty) 
              ? runs[1].parameters.frequency_penalty.join(', ') 
              : runs[1].parameters.frequency_penalty}
          </div>
          
          <div className="col-span-1">Presence Penalty</div>
          <div className={`col-span-1 ${isDifferent('presence_penalty', 0) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[0].parameters.presence_penalty) 
              ? runs[0].parameters.presence_penalty.join(', ') 
              : runs[0].parameters.presence_penalty}
          </div>
          <div className={`col-span-1 ${isDifferent('presence_penalty', 1) ? 'bg-yellow-50' : ''}`}>
            {Array.isArray(runs[1].parameters.presence_penalty) 
              ? runs[1].parameters.presence_penalty.join(', ') 
              : runs[1].parameters.presence_penalty}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {runs.map((run, index) => (
          <div key={run.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium">Run {index + 1}</h3>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(run.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="p-4">
              {run.results && run.results.map((result, resultIndex) => (
                <div key={resultIndex} className="mb-4 last:mb-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      T: {result.parameters.temperature}
                    </span>
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                      M: {result.parameters.max_tokens}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      FP: {result.parameters.frequency_penalty}
                    </span>
                    <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      PP: {result.parameters.presence_penalty}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{result.output}</p>
                  </div>
                </div>
              ))}
              
              {(!run.results || run.results.length === 0) && (
                <div className="text-gray-500 italic">No results available</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 