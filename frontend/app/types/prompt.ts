export interface PromptRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface TextAnalysis {
  wordCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface PromptResponse {
  success: boolean;
  response?: string;
  error?: string;
  usage?: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
  analysis?: TextAnalysis;
}

export interface PromptParameters {
  temperature: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
}

export interface ParameterSets {
  temperatures: number[];
  maxTokens: number[];
  frequencyPenalties: number[];
  presencePenalties: number[];
}

export interface PromptResult {
  output?: string;
  response?: string;
  parameters: PromptParameters;
  error?: string;
}

export interface BatchPromptRequest {
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  parameterSets: {
    temperatures: number[];
    max_tokens: number[];
    frequency_penalties: number[];
    presence_penalties: number[];
  };
}

export interface BatchPromptResponse {
  success: boolean;
  results: PromptResult[];
  error?: string;
}

export interface PromptRun {
  id: string;
  timestamp: string;
  systemPrompt: string;
  userPrompt: string;
  model: string;
  parameters: PromptParameters;
  results: PromptResult[];
}

 