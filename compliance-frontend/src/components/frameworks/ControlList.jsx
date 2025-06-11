import React, { useEffect, useState } from 'react';
import { useFramework } from '../../context/framework-state';
import { getFrameworkControls } from '../../api/frameworks';
import Alert from '../common/Alert';
import { Link } from 'react-router-dom';

const ControlList = () => {
  const { currentFramework } = useFramework();
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadControls = async () => {
      if (!currentFramework) return;
      
      try {
        setLoading(true);
        const data = await getFrameworkControls(currentFramework.id);
        setControls(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load controls');
      } finally {
        setLoading(false);
      }
    };
    loadControls();
  }, [currentFramework]);

  if (!currentFramework) return <div>Please select a framework first</div>;
  if (loading) return <div>Loading controls...</div>;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="control-list">
      <h3>{currentFramework.name} Controls</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {controls.map(control => (
            <tr key={control.id}>
              <td>{control.refId}</td>
              <td>{control.name}</td>
              <td>{control.description.substring(0, 50)}...</td>
              <td>
                <span className={`status-badge ${control.status}`}>
                  {control.status}
                </span>
              </td>
              <td>
                <Link to={`/controls/${control.id}`} className="view-link">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ControlList;