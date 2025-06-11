import React, { useState } from 'react';
import { useFramework } from '../../context/framework-state';
import { generateReport } from '../../api/reports';
import Alert from '../common/Alert';

const ReportGenerator = () => {
  const { currentFramework } = useFramework();
  const [reportType, setReportType] = useState('compliance_status');
  const [format, setFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async () => {
    if (!currentFramework) {
      return setError('Please select a framework first');
    }
    
    try {
      setLoading(true);
      setError('');
      const report = await generateReport({
        frameworkId: currentFramework.id,
        type: reportType,
        format
      });
      setSuccess(`Report generated successfully. Downloading...`);
      
      // Create a temporary link to download the report
      const url = window.URL.createObjectURL(new Blob([report.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `compliance_report_${currentFramework.name}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-generator">
      <h2>Generate Compliance Report</h2>
      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}
      
      <div className="form-group">
        <label>Framework</label>
        <input 
          type="text" 
          value={currentFramework?.name || 'No framework selected'} 
          disabled 
        />
      </div>
      
      <div className="form-group">
        <label>Report Type</label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="compliance_status">Compliance Status</option>
          <option value="control_coverage">Control Coverage</option>
          <option value="risk_assessment">Risk Assessment</option>
          <option value="gap_analysis">Gap Analysis</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Format</label>
        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
          <option value="excel">Excel</option>
        </select>
      </div>
      
      <button 
        onClick={handleGenerate} 
        disabled={loading || !currentFramework}
        className="generate-btn"
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
    </div>
  );
};

export default ReportGenerator;