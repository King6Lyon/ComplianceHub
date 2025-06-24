import { useEffect, useState } from 'react';
import { getFrameworkProgress } from '../../api/frameworks';
import { Doughnut } from 'react-chartjs-2';
import Loading from '../common/Loading';
import Alert from '../common/Alert';
import { PieChart } from 'lucide-react'; // ou un autre icône valide


const FrameworkProgress = ({ framework }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getFrameworkProgress(framework._id);
        setProgress(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [framework._id]);

  if (loading) return <Loading />;
  if (error) return <Alert type="error" message={error} />;
  if (!progress) return <p className="text-sm text-gray-500">No progress data available.</p>;

  const data = {
    labels: ['Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable'],
    datasets: [
      {
        data: [
          progress.implemented,
          progress.partial,
          progress.notImplemented,
          progress.notApplicable
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
        hoverBackgroundColor: ['#059669', '#D97706', '#DC2626', '#4B5563']
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieChart  className="text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">
          {framework.name} – Compliance Overview
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Chart */}
        <div className="h-64 md:h-80">
          <Doughnut data={data} options={options} />
        </div>

        {/* Stats */}
        <div>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700">Overall Progress</h4>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{ width: `${progress.overallProgress}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {progress.overallProgress}% complete ({progress.implemented} of {progress.totalControls} controls)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-green-800">Implemented</p>
              <p className="text-2xl font-bold text-green-600">{progress.implemented}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-yellow-800">Partially Implemented</p>
              <p className="text-2xl font-bold text-yellow-600">{progress.partial}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-red-800">Not Implemented</p>
              <p className="text-2xl font-bold text-red-600">{progress.notImplemented}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-800">Not Applicable</p>
              <p className="text-2xl font-bold text-gray-700">{progress.notApplicable}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameworkProgress;
