import { useMemo } from 'react';

export const useRiskMatrix = (risks) => {
  const matrixData = useMemo(() => {
    // Initialize matrix structure
    const matrix = {
      high: { low: { level: 'medium', count: 0 }, medium: { level: 'high', count: 0 }, high: { level: 'high', count: 0 } },
      medium: { low: { level: 'low', count: 0 }, medium: { level: 'medium', count: 0 }, high: { level: 'high', count: 0 } },
      low: { low: { level: 'low', count: 0 }, medium: { level: 'low', count: 0 }, high: { level: 'medium', count: 0 } }
    };

    // Count risks in each matrix cell
    risks.forEach(risk => {
      const level = getRiskLevel(risk.likelihood, risk.impact);
      risk.level = level; // Add level to risk object
      
      // Count risks in the matrix
      if (matrix[risk.impact] && matrix[risk.impact][risk.likelihood]) {
        matrix[risk.impact][risk.likelihood].count += 1;
      }
    });

    return matrix;
  }, [risks]);

  const getRiskCount = (impact, likelihood) => {
    return matrixData[impact][likelihood].count;
  };

  const getRiskLevel = (likelihood, impact) => {
    const levels = {
      low: { low: 'low', medium: 'low', high: 'medium' },
      medium: { low: 'low', medium: 'medium', high: 'high' },
      high: { low: 'medium', medium: 'high', high: 'high' }
    };
    return levels[likelihood][impact];
  };

  return { matrixData, getRiskCount };
};