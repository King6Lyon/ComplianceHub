import { useMemo } from 'react';

export const useRiskMatrix = (risks) => {
  // Fonction utilitaire pour calculer le niveau de risque
  const getRiskLevel = (likelihood, impact) => {
    const levels = {
      low: { low: 'low', medium: 'low', high: 'medium' },
      medium: { low: 'low', medium: 'medium', high: 'high' },
      high: { low: 'medium', medium: 'high', high: 'high' }
    };
    return levels[likelihood]?.[impact] || 'low'; // Valeur par défaut si clé manquante
  };

  const matrixData = useMemo(() => {
    const matrix = {
      high: {
        low: { level: 'medium', count: 0 },
        medium: { level: 'high', count: 0 },
        high: { level: 'high', count: 0 }
      },
      medium: {
        low: { level: 'low', count: 0 },
        medium: { level: 'medium', count: 0 },
        high: { level: 'high', count: 0 }
      },
      low: {
        low: { level: 'low', count: 0 },
        medium: { level: 'low', count: 0 },
        high: { level: 'medium', count: 0 }
      }
    };

    if (Array.isArray(risks)) {
      risks.forEach(risk => {
        const { likelihood, impact } = risk;
        const level = getRiskLevel(likelihood, impact);
        risk.level = level;

        if (matrix[impact]?.[likelihood]) {
          matrix[impact][likelihood].count += 1;
        }
      });
    }

    return matrix;
  }, [risks]);

  const getRiskCount = (impact, likelihood) => {
    return matrixData[impact]?.[likelihood]?.count || 0;
  };

  return { matrixData, getRiskCount };
};
