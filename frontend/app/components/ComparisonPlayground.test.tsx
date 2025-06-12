import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComparisonPlayground from './ComparisonPlayground';

// Mock the API fetch call
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      success: true,
      results: [
        {
          parameters: {
            temperature: 0.7,
            maxTokens: 150,
            frequencyPenalty: 0,
            presencePenalty: 0
          },
          response: 'Test response content',
          usage: {
            prompt_tokens: 20,
            completion_tokens: 30,
            total_tokens: 50
          },
          analysis: {
            wordCount: 3,
            sentiment: 'neutral'
          },
          elapsedTimeMs: 1200
        }
      ]
    })
  })
) as jest.Mock;

// Mock the uuid generator
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('ComparisonPlayground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

  test('renders the playground tab by default', () => {
    render(<ComparisonPlayground />);
    expect(screen.getByText('System Prompt')).toBeInTheDocument();
    expect(screen.getByText('User Prompt')).toBeInTheDocument();
    expect(screen.getByText('Run Comparison')).toBeInTheDocument();
  });

  test('can switch to the history tab', () => {
    render(<ComparisonPlayground />);
    fireEvent.click(screen.getByText('History'));
    expect(screen.getByText('No history yet. Run some comparisons to see them here.')).toBeInTheDocument();
  });

  test('submits the form and saves to history', async () => {
    render(<ComparisonPlayground />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('User Prompt'), {
      target: { value: 'Test user prompt' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Run Comparison'));
    
    // Wait for the API call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    });
    
    // Check that the response is displayed
    expect(screen.getByText('Test response content')).toBeInTheDocument();
  });
}); 