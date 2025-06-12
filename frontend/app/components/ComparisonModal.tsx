'use client';

import React from 'react';
import { ComparisonData } from '../types/history';

interface ComparisonModalProps {
  data: ComparisonData;
  onClose: () => void;
}

export default function ComparisonModal({ data, onClose }: ComparisonModalProps) {
  const formatParameterName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Session Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Parameter Differences */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Parameter Differences</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Parameter</div>
              <div className="font-medium">Session 1</div>
              <div className="font-medium">Session 2</div>
              {Object.entries(data.differences.parameterDiffs).map(([key, values]) => (
                <React.Fragment key={key}>
                  <div>{formatParameterName(key)}</div>
                  <div className="text-blue-600">{values.session1Value}</div>
                  <div className="text-green-600">{values.session2Value}</div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Response Differences */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Response Differences</h3>
            <div className="space-y-4">
              {data.differences.responseDiffs.map((diff, index) => (
                <div key={index} className="border rounded p-4">
                  <h4 className="font-medium mb-2">Response Set {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-blue-600 mb-2">Session 1</h5>
                      <p className="whitespace-pre-wrap">{diff.session1Response}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-green-600 mb-2">Session 2</h5>
                      <p className="whitespace-pre-wrap">{diff.session2Response}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Differences</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {diff.differences.map((difference, i) => (
                        <li key={i} className="text-sm">
                          {difference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 