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
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface ParameterSets {
  temperatures: number[];
  maxTokens: number[];
  frequencyPenalties: number[];
  presencePenalties: number[];
}

export interface BatchPromptRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  parameterSets: ParameterSets;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface PromptResult {
  parameters: PromptParameters;
  response: string;
  error?: string;
  usage?: TokenUsage;
  analysis?: TextAnalysis;
  elapsedTimeMs?: number;
}

export interface BatchPromptResponse {
  success: boolean;
  error?: string;
  results: PromptResult[];
}

 