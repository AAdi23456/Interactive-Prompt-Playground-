export interface PromptRun {
  id: string;
  timestamp: string;
  systemPrompt: string;
  userPrompt: string;
  model: string;
  parameters: {
    temperature: number;
    max_tokens: number;
    frequency_penalty: number;
    presence_penalty: number;
  };
  results: Array<{
    parameters: {
      temperature: number;
      max_tokens: number;
      frequency_penalty: number;
      presence_penalty: number;
    };
    output: string;
  }>;
}

const HISTORY_KEY = 'prompt_history';

export const saveToHistory = (promptRun: PromptRun) => {
  try {
    const history = getHistory();
    history.unshift(promptRun); // Add new result at the beginning
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

export const getHistory = (): PromptRun[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const deleteFromHistory = (id: string) => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Error deleting from history:', error);
    return getHistory();
  }
};

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}; 