import React, { useState, useCallback } from 'react';
import { BatchPromptRequest, BatchPromptResponse, ParameterSets } from '../types/prompt';
import ParameterSelector from './ParameterSelector';
import ResultsGrid from './ResultsGrid';

const DEFAULT_PARAMETER_SETS: ParameterSets = {
  temperatures: [0.7],
  maxTokens: [150],
  frequencyPenalties: [0],
  presencePenalties: [0]
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
    <span className="ml-2">Processing comparison...</span>
  </div>
);

const ComparisonPlayground: React.FC = () => {
  // State Management
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [parameterSets, setParameterSets] = useState<ParameterSets>(DEFAULT_PARAMETER_SETS);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<BatchPromptResponse | null>(null);
  const [validationError, setValidationError] = useState('');

  // Parameter Management
  const handleParameterChange = useCallback((paramType: keyof ParameterSets, values: number[]) => {
    setParameterSets(prev => ({
      ...prev,
      [paramType]: values
    }));
  }, []);

  // Core Functionality - Phase 3, 4, 5
  const handleRunComparison = useCallback(async () => {
    // Validate inputs
    if (!userPrompt.trim()) {
      setValidationError('User prompt is required');
      return;
    }
    
    setValidationError('');
    setIsLoading(true);
    
    try {
      const request: BatchPromptRequest = {
        model: 'gpt-3.5-turbo',
        systemPrompt,
        userPrompt,
        parameterSets
      };

      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      const data: BatchPromptResponse = await response.json();
      setCurrentResponse(data);
    } catch (error) {
      console.error('Failed to run comparison:', error);
      setCurrentResponse({
        success: false,
        error: 'Failed to run comparison. Please try again.',
        results: []
      });
    } finally {
      setIsLoading(false);
    }
  }, [systemPrompt, userPrompt, parameterSets]);

  // UI for all phases
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">
              System Prompt <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={3}
              placeholder="Instructions for the AI model..."
            />
          </div>

          <div>
            <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700">
              User Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              id="userPrompt"
              value={userPrompt}
              onChange={(e) => {
                setUserPrompt(e.target.value);
                if (e.target.value.trim()) {
                  setValidationError('');
                }
              }}
              className={`mt-1 block w-full rounded-md ${
                validationError ? 'border-red-500' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
              rows={3}
              required
              placeholder="Enter your prompt here..."
            />
            {validationError && (
              <p className="mt-1 text-sm text-red-500">{validationError}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Parameter Settings</h3>
          <ParameterSelector
            parameterSets={parameterSets}
            onChange={handleParameterChange}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRunComparison}
            disabled={isLoading || !userPrompt.trim()}
            className={`px-4 py-2 rounded-md text-white font-medium
              ${isLoading || !userPrompt.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Running...' : 'Run Comparison'}
          </button>
        </div>

        {isLoading && (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && currentResponse && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Comparison Results</h2>
            <ResultsGrid response={currentResponse} />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ComparisonPlayground); 