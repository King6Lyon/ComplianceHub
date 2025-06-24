import React from 'react';
import { useRiskMatrix } from '../../hooks/useRiskMatrix';

const RiskMatrix = ({ risks }) => {
  const { matrixData, getRiskCount } = useRiskMatrix(risks);

  const impactLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  };

  const levelColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Risk Matrix</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-sm text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">Impact \ Likelihood</th>
              <th className="px-4 py-2 border">Low</th>
              <th className="px-4 py-2 border">Medium</th>
              <th className="px-4 py-2 border">High</th>
            </tr>
          </thead>
          <tbody>
            {['high', 'medium', 'low'].map((impact) => (
              <tr key={impact} className="border-t">
                <td className="border px-4 py-2 font-medium text-gray-700">
                  {impactLabels[impact]}
                </td>
                {['low', 'medium', 'high'].map((likelihood) => {
                  const level = matrixData[impact][likelihood].level;
                  return (
                    <td
                      key={`${impact}-${likelihood}`}
                      className={`border px-4 py-2 font-semibold rounded-sm ${levelColors[level]}`}
                    >
                      {getRiskCount(impact, likelihood)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-green-400"></span>
          <span className="text-sm text-gray-700">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-yellow-400"></span>
          <span className="text-sm text-gray-700">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-red-400"></span>
          <span className="text-sm text-gray-700">High Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;
