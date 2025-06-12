'use client';

import { useReducer, useCallback, useRef, useEffect } from 'react';
import { PromptRun } from '../types/prompt';

type HistoryAction =
  | { type: 'ADD', history: PromptRun }
  | { type: 'DELETE', id: string }
  | { type: 'CLEAR' }
  | { type: 'SET', histories: PromptRun[] };

function historyReducer(state: PromptRun[], action: HistoryAction): PromptRun[] {
  switch (action.type) {
    case 'ADD':
      return [action.history, ...state];
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

const isDuplicate = (history1: PromptRun, history2: PromptRun): boolean => {
  return (
    history1.systemPrompt === history2.systemPrompt &&
    history1.userPrompt === history2.userPrompt &&
    history1.model === history2.model &&
    JSON.stringify(history1.parameters) === JSON.stringify(history2.parameters)
  );
};

const STORAGE_KEY = 'prompt_history';

const getStoredHistories = (): PromptRun[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error('Error reading history from localStorage:', error);
    return [];
  }
};

const saveToLocalStorage = (histories: PromptRun[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
  } catch (error) {
    console.error('Error saving history to localStorage:', error);
  }
};

export function usePromptHistory() {
  const [histories, dispatch] = useReducer(historyReducer, [], getStoredHistories);
  const lastAddedHistoryRef = useRef<PromptRun | null>(null);

  useEffect(() => {
    saveToLocalStorage(histories);
  }, [histories]);

  const addHistory = useCallback((history: PromptRun) => {
    // Check if this history is a duplicate of the last added one
    if (lastAddedHistoryRef.current && isDuplicate(lastAddedHistoryRef.current, history)) {
      return;
    }

    lastAddedHistoryRef.current = history;
    dispatch({ type: 'ADD', history });
  }, []);

  const deleteHistory = useCallback((id: string) => {
    dispatch({ type: 'DELETE', id });
  }, []);

  const clearHistories = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    histories,
    addHistory,
    deleteHistory,
    clearHistories,
  };
} 