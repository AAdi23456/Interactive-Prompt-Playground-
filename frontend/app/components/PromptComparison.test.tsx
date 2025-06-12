import { render, screen } from '@testing-library/react';
import PromptComparison from './PromptComparison';
import { PromptHistory } from '../types/prompt';

// Mock the diff library
jest.mock('diff', () => ({
  diffWords: jest.fn(() => [
    { value: 'This is ', added: undefined, removed: undefined },
    { value: 'an example', added: undefined, removed: undefined },
    { value: ' test', added: undefined, removed: undefined },
    { value: ' with differences', added: true, removed: undefined },
    { value: ' in text', removed: true, added: undefined }
  ])
}));

describe('PromptComparison', () => {
  const mockSessions: [PromptHistory, PromptHistory] = [
    {
      id: 'session1',
      timestamp: '2023-06-10T10:00:00Z',
      request: {
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'Tell me about AI',
        parameterSets: {
          temperatures: [0.7],
          maxTokens: [150],
          frequencyPenalties: [0],
          presencePenalties: [0]
        }
      },
      response: {
        success: true,
        results: [
          {
            parameters: {
              temperature: 0.7,
              maxTokens: 150,
              frequencyPenalty: 0,
              presencePenalty: 0
            },
            response: 'This is an example test in text',
            usage: {
              prompt_tokens: 20,
              completion_tokens: 30,
              total_tokens: 50
            },
            analysis: {
              wordCount: 6,
              sentiment: 'neutral'
            }
          }
        ]
      }
    },
    {
      id: 'session2',
      timestamp: '2023-06-10T11:00:00Z',
      request: {
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are a creative assistant',
        userPrompt: 'Tell me about AI',
        parameterSets: {
          temperatures: [0.9],
          maxTokens: [200],
          frequencyPenalties: [0],
          presencePenalties: [0]
        }
      },
      response: {
        success: true,
        results: [
          {
            parameters: {
              temperature: 0.9,
              maxTokens: 200,
              frequencyPenalty: 0,
              presencePenalty: 0
            },
            response: 'This is an example test with differences',
            usage: {
              prompt_tokens: 20,
              completion_tokens: 35,
              total_tokens: 55
            },
            analysis: {
              wordCount: 7,
              sentiment: 'neutral'
            }
          }
        ]
      }
    }
  ];

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the comparison modal', () => {
    render(<PromptComparison sessions={mockSessions} onClose={mockOnClose} />);
    
    // Check that basic elements are present
    expect(screen.getByText('Session Comparison')).toBeInTheDocument();
    expect(screen.getByText('System Prompt:')).toBeInTheDocument();
    expect(screen.getByText('You are a helpful assistant')).toBeInTheDocument();
    expect(screen.getByText('You are a creative assistant')).toBeInTheDocument();
  });

  test('displays parameter values', () => {
    render(<PromptComparison sessions={mockSessions} onClose={mockOnClose} />);
    
    // Check that parameters are displayed
    expect(screen.getByText('T: 0.7 | MT: 150 | FP: 0 | PP: 0')).toBeInTheDocument();
    expect(screen.getByText('T: 0.9 | MT: 200 | FP: 0 | PP: 0')).toBeInTheDocument();
  });

  test('shows the diff between responses', () => {
    render(<PromptComparison sessions={mockSessions} onClose={mockOnClose} />);
    
    // The diffWords mock will create these sections of text
    expect(screen.getByText('This is ')).toBeInTheDocument();
    expect(screen.getByText('an example')).toBeInTheDocument();
    expect(screen.getByText(' test')).toBeInTheDocument();
    
    // These should be highlighted as additions/removals
    const additions = screen.getByText(' with differences');
    expect(additions).toBeInTheDocument();
    expect(additions).toHaveClass('bg-green-100');
    
    const removals = screen.getByText(' in text');
    expect(removals).toBeInTheDocument();
    expect(removals).toHaveClass('bg-red-100');
  });
}); 