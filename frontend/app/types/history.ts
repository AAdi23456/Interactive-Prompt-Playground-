export interface PromptParameters {
  temperature: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface PromptSession {
  id: string;
  systemPrompt: string;
  userPrompt: string;
  model: string;
  timestamp: Date;
  parameterSets: PromptParameters[];
  responses: {
    parameters: PromptParameters;
    response: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }[];
}

export interface ComparisonData {
  sessions: PromptSession[];
  differences: {
    parameterDiffs: {
      [key: string]: {
        session1Value: any;
        session2Value: any;
      };
    };
    responseDiffs: {
      index: number;
      session1Response: string;
      session2Response: string;
      differences: string[];
    }[];
  };
} 