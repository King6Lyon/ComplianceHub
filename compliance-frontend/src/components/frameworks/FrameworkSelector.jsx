// src/components/frameworks/FrameworkSelector.jsx
import React, { useEffect, useState } from 'react';
import { getFrameworks } from '../../api/frameworks';
import Alert from '../common/Alert';
import { useFramework } from '../../context/framework-state';
import { ShieldCheck } from 'lucide-react';

const FrameworkSelector = () => {
  const { currentFramework, setCurrentFramework } = useFramework();
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getFrameworks();
        setFrameworks(data);

        if (!currentFramework && data.length) {
          setCurrentFramework(data[0]);
        }
      } catch (err) {
        setError(err.message || 'Échec du chargement des frameworks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentFramework, setCurrentFramework]);

  const handleChange = (e) => {
    const selected = frameworks.find(f => f._id === e.target.value);
    if (selected) setCurrentFramework(selected);
  };

  if (loading) return <div className="text-gray-500">Chargement des frameworks...</div>;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full max-w-xl mx-auto my-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-blue-600" />
        <h2 className="text-xl font-semibold">Select Compliance Framework</h2>
      </div>

      <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-2">
        Available Frameworks
      </label>
      <select
        id="framework"
        value={currentFramework?._id || ''}
        onChange={handleChange}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
      >
        {frameworks.map(framework => (
          <option key={framework._id} value={framework._id}>
            {framework.name} ({framework.version})
          </option>
        ))}
      </select>
    </div>
  );
};

export default FrameworkSelector;
