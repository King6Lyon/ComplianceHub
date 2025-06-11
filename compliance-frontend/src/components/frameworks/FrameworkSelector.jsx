import React, { useEffect, useState } from 'react';
import { useFramework } from '../../context/framework-state';
import { getFrameworks } from '../../api/frameworks';
import Alert from '../common/Alert';

const FrameworkSelector = () => {
  const { currentFramework, setCurrentFramework } = useFramework();
  const [frameworks, setFrameworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        const data = await getFrameworks();
        setFrameworks(data);
        if (data.length > 0 && !currentFramework) {
          setCurrentFramework(data[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load frameworks');
      } finally {
        setLoading(false);
      }
    };
    loadFrameworks();
  }, [currentFramework, setCurrentFramework]);

  const handleChange = (e) => {
    const selected = frameworks.find(f => f.id === e.target.value);
    if (selected) {
      setCurrentFramework(selected);
    }
  };

  if (loading) return <div>Loading frameworks...</div>;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="framework-selector">
      <label>Select Compliance Framework:</label>
      <select 
        value={currentFramework?.id || ''}
        onChange={handleChange}
        disabled={frameworks.length === 0}
      >
        {frameworks.map(framework => (
          <option key={framework.id} value={framework.id}>
            {framework.name} ({framework.version})
          </option>
        ))}
      </select>
    </div>
  );
};

export default FrameworkSelector;