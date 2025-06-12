'use client';

import { useState, FormEvent } from 'react';
import { PromptParameters } from '../types/prompt';

interface PromptFormProps {
  onSubmit: (data: {
    systemPrompt: string;
    userPrompt: string;
    model: string;
    parameters: PromptParameters;
  }) => Promise<any>;
  isLoading: boolean;
}

export default function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [parameters, setParameters] = useState<PromptParameters>({
    temperature: 0.7,
    max_tokens: 150,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    await onSubmit({
      systemPrompt,
      userPrompt,
      model,
      parameters,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt (Optional)
        </label>
        <textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter system prompt..."
        />
      </div>

      <div>
        <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700 mb-2">
          User Prompt
        </label>
        <textarea
          id="userPrompt"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your prompt..."
          required
        />
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
          Model
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          
        </select>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
            Temperature: {parameters.temperature}
          </label>
          <input
            type="range"
            id="temperature"
            min="0"
            max="2"
            step="0.1"
            value={parameters.temperature}
            onChange={(e) => setParameters({ ...parameters, temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-2">
            Max Tokens: {parameters.max_tokens}
          </label>
          <input
            type="range"
            id="max_tokens"
            min="50"
            max="2000"
            step="50"
            value={parameters.max_tokens}
            onChange={(e) => setParameters({ ...parameters, max_tokens: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="frequency_penalty" className="block text-sm font-medium text-gray-700 mb-2">
            Frequency Penalty: {parameters.frequency_penalty}
          </label>
          <input
            type="range"
            id="frequency_penalty"
            min="0"
            max="2"
            step="0.1"
            value={parameters.frequency_penalty}
            onChange={(e) => setParameters({ ...parameters, frequency_penalty: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="presence_penalty" className="block text-sm font-medium text-gray-700 mb-2">
            Presence Penalty: {parameters.presence_penalty}
          </label>
          <input
            type="range"
            id="presence_penalty"
            min="0"
            max="2"
            step="0.1"
            value={parameters.presence_penalty}
            onChange={(e) => setParameters({ ...parameters, presence_penalty: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !userPrompt.trim()}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
          isLoading || !userPrompt.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
} 