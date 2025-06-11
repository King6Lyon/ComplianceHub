import React, { useState, useEffect } from 'react';
import { getReports, downloadReport } from '../../api/reports';
import Alert from '../common/Alert';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const handleDownload = async (reportId, filename) => {
    try {
      const response = await downloadReport(reportId);
      
      // Create a temporary link to download the report
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download report');
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="report-list">
      <h2>Generated Reports</h2>
      {error && <Alert type="error" message={error} />}
      
      {reports.length === 0 ? (
        <p>No reports generated yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Framework</th>
              <th>Generated At</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.type}</td>
                <td>{report.framework?.name || 'N/A'}</td>
                <td>{new Date(report.generatedAt).toLocaleString()}</td>
                <td>{report.format.toUpperCase()}</td>
                <td>
                  <button 
                    onClick={() => handleDownload(report.id, report.name)}
                    className="download-btn"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportList;