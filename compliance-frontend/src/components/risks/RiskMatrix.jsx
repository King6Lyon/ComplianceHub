import React from 'react';
import { useRiskMatrix } from '../../hooks/useRiskMatrix';

const RiskMatrix = ({ risks }) => {
  const { matrixData, getRiskCount } = useRiskMatrix(risks);

  return (
    <div className="risk-matrix">
      <h2>Risk Matrix</h2>
      <table>
        <thead>
          <tr>
            <th>Impact \ Likelihood</th>
            <th>Low</th>
            <th>Medium</th>
            <th>High</th>
          </tr>
        </thead>
        <tbody>
          {['high', 'medium', 'low'].map(impact => (
            <tr key={impact}>
              <td>{impact.charAt(0).toUpperCase() + impact.slice(1)}</td>
              {['low', 'medium', 'high'].map(likelihood => (
                <td 
                  key={`${impact}-${likelihood}`}
                  className={`risk-cell ${matrixData[impact][likelihood].level}`}
                >
                  {getRiskCount(impact, likelihood)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="risk-legend">
        <div className="legend-item">
          <span className="legend-color high"></span>
          <span>High Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color medium"></span>
          <span>Medium Risk</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low"></span>
          <span>Low Risk</span>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;