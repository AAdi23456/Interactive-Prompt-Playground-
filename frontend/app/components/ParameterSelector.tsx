import React from 'react';
import { Slider } from '@mui/material';
import { ParameterSets } from '../types/prompt';

interface ParameterSelectorProps {
  parameterSets: ParameterSets;
  onChange: (paramType: keyof ParameterSets, values: number[]) => void;
}

const PARAMETER_RANGES = {
  temperatures: {
    min: 0,
    max: 1.2,
    step: 0.1,
    defaultValues: [0.7],
    marks: [
      { value: 0, label: '0' },
      { value: 0.7, label: '0.7' },
      { value: 1.2, label: '1.2' }
    ]
  },
  maxTokens: {
    min: 50,
    max: 300,
    step: 50,
    defaultValues: [150],
    marks: [
      { value: 50, label: '50' },
      { value: 150, label: '150' },
      { value: 300, label: '300' }
    ]
  },
  frequencyPenalties: {
    min: 0,
    max: 1.5,
    step: 0.1,
    defaultValues: [0],
    marks: [
      { value: 0, label: '0' },
      { value: 1.5, label: '1.5' }
    ]
  },
  presencePenalties: {
    min: 0,
    max: 1.5,
    step: 0.1,
    defaultValues: [0],
    marks: [
      { value: 0, label: '0' },
      { value: 1.5, label: '1.5' }
    ]
  }
};

const ParameterSelector: React.FC<ParameterSelectorProps> = ({ parameterSets, onChange }) => {
  const handleSliderChange = (paramType: keyof ParameterSets) => (event: Event, value: number | number[]) => {
    onChange(paramType, Array.isArray(value) ? value : [value]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Temperature</h3>
        <Slider
          value={parameterSets.temperatures}
          onChange={handleSliderChange('temperatures')}
          valueLabelDisplay="auto"
          min={PARAMETER_RANGES.temperatures.min}
          max={PARAMETER_RANGES.temperatures.max}
          step={PARAMETER_RANGES.temperatures.step}
          marks={PARAMETER_RANGES.temperatures.marks}
        />
        <div className="text-sm text-gray-500 mt-1">
          Selected values: {parameterSets.temperatures.join(', ')}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Max Tokens</h3>
        <Slider
          value={parameterSets.maxTokens}
          onChange={handleSliderChange('maxTokens')}
          valueLabelDisplay="auto"
          min={PARAMETER_RANGES.maxTokens.min}
          max={PARAMETER_RANGES.maxTokens.max}
          step={PARAMETER_RANGES.maxTokens.step}
          marks={PARAMETER_RANGES.maxTokens.marks}
        />
        <div className="text-sm text-gray-500 mt-1">
          Selected values: {parameterSets.maxTokens.join(', ')}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Frequency Penalty</h3>
        <Slider
          value={parameterSets.frequencyPenalties}
          onChange={handleSliderChange('frequencyPenalties')}
          valueLabelDisplay="auto"
          min={PARAMETER_RANGES.frequencyPenalties.min}
          max={PARAMETER_RANGES.frequencyPenalties.max}
          step={PARAMETER_RANGES.frequencyPenalties.step}
          marks={PARAMETER_RANGES.frequencyPenalties.marks}
        />
        <div className="text-sm text-gray-500 mt-1">
          Selected values: {parameterSets.frequencyPenalties.join(', ')}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Presence Penalty</h3>
        <Slider
          value={parameterSets.presencePenalties}
          onChange={handleSliderChange('presencePenalties')}
          valueLabelDisplay="auto"
          min={PARAMETER_RANGES.presencePenalties.min}
          max={PARAMETER_RANGES.presencePenalties.max}
          step={PARAMETER_RANGES.presencePenalties.step}
          marks={PARAMETER_RANGES.presencePenalties.marks}
        />
        <div className="text-sm text-gray-500 mt-1">
          Selected values: {parameterSets.presencePenalties.join(', ')}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        Total combinations: {
          parameterSets.temperatures.length *
          parameterSets.maxTokens.length *
          parameterSets.frequencyPenalties.length *
          parameterSets.presencePenalties.length
        }
      </div>
    </div>
  );
};

export default React.memo(ParameterSelector); 