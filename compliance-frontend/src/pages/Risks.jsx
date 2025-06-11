import React from 'react';
import RiskAssessment from '../components/risks/RiskAssessment';
import RiskMatrix from '../components/risks/RiskMatrix';

const Risks = () => {
  return (
    <div className="risks-page">
      <h1>Risk Management</h1>
      <div className="risk-container">
        <RiskAssessment />
        <RiskMatrix />
      </div>
    </div>
  );
};

export default Risks;