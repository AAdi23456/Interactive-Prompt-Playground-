import { render, screen } from '@testing-library/react';
import PromptComparison from './PromptComparison';
import { PromptRun } from '../types/prompt';

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
  const mockSessions: [PromptRun, PromptRun] = [
    {
      id: 'session1',
      timestamp: '2023-06-10T10:00:00Z',
      systemPrompt: 'You are a helpful assistant',
      userPrompt: 'Tell me about AI',
      model: 'gpt-3.5-turbo',
      parameters: {
        temperature: 0.7,
        max_tokens: 150,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      results: [
        {
          parameters: {
            temperature: 0.7,
            max_tokens: 150,
            frequency_penalty: 0,
            presence_penalty: 0
          },
          response: 'This is an example test in text'
        }
      ]
    },
    {
      id: 'session2',
      timestamp: '2023-06-10T11:00:00Z',
      systemPrompt: 'You are a creative assistant',
      userPrompt: 'Tell me about AI',
      model: 'gpt-3.5-turbo',
      parameters: {
        temperature: 0.9,
        max_tokens: 200,
        frequency_penalty: 0,
        presence_penalty: 0
      },
      results: [
        {
          parameters: {
            temperature: 0.9,
            max_tokens: 200,
            frequency_penalty: 0,
            presence_penalty: 0
          },
          response: 'This is an example test with differences'
        }
      ]
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