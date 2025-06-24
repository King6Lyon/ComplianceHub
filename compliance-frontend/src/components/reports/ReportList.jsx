import React, { useState, useEffect } from 'react';
import { getReports, downloadReport } from '../../api/reports';
import Alert from '../common/Alert';
import { ArrowDownCircle, FileText } from 'lucide-react';

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

  if (loading) {
    return <div className="text-center text-gray-600 py-6">Loading reports...</div>;
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Generated Reports
        </h2>
      </div>

      {error && <Alert type="error" message={error} />}

      {reports.length === 0 ? (
        <p className="text-gray-500 text-center">No reports generated yet</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Framework</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Generated At</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Format</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {reports.map(report => (
                <tr key={report.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">{report.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 capitalize">{report.type.replace('_', ' ')}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">{report.framework?.name || 'N/A'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {new Date(report.generatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 uppercase">{report.format}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleDownload(report.id, report.name)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      <ArrowDownCircle className="w-5 h-5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportList;
