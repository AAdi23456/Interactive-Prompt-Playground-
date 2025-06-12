'use client';

import { useState } from 'react';

interface PromptFormProps {
  onSubmit: (data: any) => Promise<any>;
  isLoading: boolean;
}

export default function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(150);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [multipleValues, setMultipleValues] = useState({
    temperature: [0.4, 0.7, 1.0],
    maxTokens: [150],
    frequencyPenalty: [0],
    presencePenalty: [0],
  });
  const [useMultipleValues, setUseMultipleValues] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      systemPrompt,
      userPrompt,
      model,
      parameters: useMultipleValues 
        ? {
            temperature: multipleValues.temperature,
            max_tokens: multipleValues.maxTokens,
            frequency_penalty: multipleValues.frequencyPenalty,
            presence_penalty: multipleValues.presencePenalty,
          }
        : {
            temperature: [temperature],
            max_tokens: [maxTokens],
            frequency_penalty: [frequencyPenalty],
            presence_penalty: [presencePenalty],
          }
    };

    await onSubmit(formData);
  };

  // Function to handle multiple value selection
  const handleMultipleSelection = (paramName: string, value: number) => {
    setMultipleValues(prev => {
      const currentValues = prev[paramName as keyof typeof prev];
      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [paramName]: currentValues.filter(v => v !== value)
          };
        } else {
          return {
            ...prev,
            [paramName]: [...currentValues, value]
          };
        }
      }
      return prev;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter system prompt..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Prompt
          </label>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your prompt..."
            required
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Parameters</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useMultiple"
              checked={useMultipleValues}
              onChange={() => setUseMultipleValues(!useMultipleValues)}
              className="mr-2 h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="useMultiple" className="text-sm text-gray-700">
              Test multiple values
            </label>
          </div>
        </div>

        {useMultipleValues ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.5, 1.8, 2.0].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleMultipleSelection('temperature', value)}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      multipleValues.temperature.includes(value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Tokens
              </label>
              <div className="flex flex-wrap gap-2">
                {[50, 100, 150, 250, 500, 1000, 1500, 2000, 4000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleMultipleSelection('maxTokens', value)}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      multipleValues.maxTokens.includes(value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency Penalty
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 0.3, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleMultipleSelection('frequencyPenalty', value)}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      multipleValues.frequencyPenalty.includes(value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Presence Penalty
              </label>
              <div className="flex flex-wrap gap-2">
                {[0, 0.3, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleMultipleSelection('presencePenalty', value)}
                    className={`px-3 py-1.5 text-sm rounded-md ${
                      multipleValues.presencePenalty.includes(value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Temperature: {temperature}
                </label>
                <span className="text-xs text-gray-500">0 - 2.0</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Max Tokens: {maxTokens}
                </label>
                <span className="text-xs text-gray-500">50 - 4000</span>
              </div>
              <input
                type="range"
                min="50"
                max="4000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Short</span>
                <span>Long</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Frequency Penalty: {frequencyPenalty}
                </label>
                <span className="text-xs text-gray-500">0 - 2.0</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Repetitive</span>
                <span>Diverse</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Presence Penalty: {presencePenalty}
                </label>
                <span className="text-xs text-gray-500">0 - 2.0</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Focused</span>
                <span>Exploratory</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !userPrompt.trim()}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium 
          ${
            isLoading || !userPrompt.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        {isLoading ? 'Generating...' : 'Run Comparison'}
      </button>
    </form>
  );
} 