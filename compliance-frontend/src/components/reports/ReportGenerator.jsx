import React, { useState } from 'react';
import { useFramework } from '../../context/framework-state';
import { generateReport } from '../../api/reports';
import Alert from '../common/Alert';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
        frameworkId: currentFramework._id,
        type: reportType,
        format
      });
      setSuccess(`Report generated successfully. Downloading...`);

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
    <div className="min-h-screen flex">
      {/* Left image */}
      <div className="hidden md:flex w-1/2 bg-blue-800 items-center justify-center p-8">
        <img
          src="https://cybersecurity.fi/assets/images/logo.png"
          alt="Generate Report"
          className="max-w-full h-auto object-contain"
        />
      </div>

      {/* Right form */}
      <div className="w-full md:w-1/2 flex flex-col px-6 py-12">
        {/* Retour */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Generate Compliance Report</h2>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Framework</label>
              <input
                type="text"
                value={currentFramework?.name || 'No framework selected'}
                disabled
                className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="compliance_status">Compliance Status</option>
                <option value="control_coverage">Control Coverage</option>
                <option value="risk_assessment">Risk Assessment</option>
                <option value="gap_analysis">Gap Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !currentFramework}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
