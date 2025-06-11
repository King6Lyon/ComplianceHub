import React from 'react';
import ReportGenerator from '../components/reports/ReportGenerator';
import ReportList from '../components/reports/ReportList';

const Reports = () => {
  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <div className="reports-container">
        <ReportGenerator />
        <ReportList />
      </div>
    </div>
  );
};

export default Reports;