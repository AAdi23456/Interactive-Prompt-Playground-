import { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import type { PromptHistory } from '../types/prompt';

const STORAGE_KEY = 'prompt_histories';
const MAX_HISTORIES = 10;

type HistoryAction = 
  | { type: 'ADD', history: PromptHistory }
  | { type: 'DELETE', id: string }
  | { type: 'CLEAR' }
  | { type: 'SET', histories: PromptHistory[] };

function historyReducer(state: PromptHistory[], action: HistoryAction): PromptHistory[] {
  switch (action.type) {
    case 'ADD':
      return [action.history, ...state].slice(0, MAX_HISTORIES);
    case 'DELETE':
      return state.filter(h => h.id !== action.id);
    case 'CLEAR':
      return [];
    case 'SET':
      return action.histories;
    default:
      return state;
  }
}

// Helper function to check if two histories are duplicates
const isDuplicate = (history1: PromptHistory, history2: PromptHistory): boolean => {
  // Check if prompts were created within 1 second of each other
  const timeDiff = Math.abs(
    new Date(history1.timestamp).getTime() - new Date(history2.timestamp).getTime()
  );
  if (timeDiff > 1000) return false;

  // Check if the content is the same
  return (
    history1.request.userPrompt === history2.request.userPrompt &&
    history1.request.systemPrompt === history2.request.systemPrompt &&
    history1.request.model === history2.request.model &&
    JSON.stringify(history1.request.parameterSets) === JSON.stringify(history2.request.parameterSets)
  );
};

// Helper function to safely parse localStorage data
const getStoredHistories = (): PromptHistory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    
    return parsed;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Helper function to safely save to localStorage
const saveToLocalStorage = (histories: PromptHistory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export function usePromptHistory() {
  const [histories, dispatch] = useReducer(historyReducer, [], () => getStoredHistories());
  const [version, setVersion] = useState(0); // Force re-render when needed
  const lastAddedHistoryRef = useRef<PromptHistory | null>(null);

  // Save to localStorage whenever histories change
  useEffect(() => {
    console.log('Saving histories to localStorage:', histories);
    saveToLocalStorage(histories);
  }, [histories]);

  const addHistory = useCallback((history: PromptHistory) => {
    console.log('Adding new history:', history);
    
    // Check for duplicates
    if (lastAddedHistoryRef.current && isDuplicate(lastAddedHistoryRef.current, history)) {
      console.log('Duplicate detected with last added history');
      return;
    }

    // Check if very similar history exists in recent entries
    const isDuplicateOfRecent = histories.some(h => isDuplicate(h, history));
    if (isDuplicateOfRecent) {
      console.log('Duplicate detected in recent history');
      return;
    }

    // Add new history
    lastAddedHistoryRef.current = history;
    dispatch({ type: 'ADD', history });
    setVersion(v => v + 1); // Force re-render
  }, [histories, isDuplicate]);

  const deleteHistory = useCallback((id: string) => {
    console.log('Deleting history with id:', id);
    dispatch({ type: 'DELETE', id });
    setVersion(v => v + 1); // Force re-render
  }, []);

  const clearHistories = useCallback(() => {
    console.log('Clearing all histories');
    dispatch({ type: 'CLEAR' });
    lastAddedHistoryRef.current = null;
    setVersion(v => v + 1); // Force re-render
  }, []);

  return {
    histories,
    addHistory,
    deleteHistory,
    clearHistories,
    version, // Export version to force child component updates
  };
} 