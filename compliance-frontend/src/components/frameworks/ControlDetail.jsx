import React, {useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFramework } from '../../context/framework-state';
import { getControlDetails, updateControlStatus } from '../../api/frameworks';
import Alert from '../common/Alert';

const ControlDetail = () => {
  const { id } = useParams();
  const { currentFramework } = useFramework();
  const [control, setControl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const loadControl = async () => {
      try {
        setLoading(true);
        const data = await getControlDetails(id);
        setControl(data);
        setStatus(data.status);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load control details');
      } finally {
        setLoading(false);
      }
    };
    loadControl();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateControlStatus(control.id, newStatus);
      setStatus(newStatus);
      setControl({ ...control, status: newStatus });
      setUpdateSuccess('Control status updated successfully');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update control status');
    }
  };

  if (loading) return <div>Loading control details...</div>;
  if (error) return <Alert type="error" message={error} />;
  if (!control) return <div>Control not found</div>;

  return (
    <div className="control-detail">
      <h2>{control.refId} - {control.name}</h2>
      {updateSuccess && <Alert type="success" message={updateSuccess} />}
      
      <div className="control-meta">
        <p><strong>Framework:</strong> {currentFramework?.name || 'N/A'}</p>
        <p><strong>Category:</strong> {control.category}</p>
      </div>
      
      <div className="control-description">
        <h3>Description</h3>
        <p>{control.description}</p>
      </div>
      
      <div className="control-guidance">
        <h3>Implementation Guidance</h3>
        <p>{control.guidance}</p>
      </div>
      
      <div className="control-status">
        <h3>Status</h3>
        <select value={status} onChange={handleStatusChange}>
          <option value="not_implemented">Not Implemented</option>
          <option value="partially_implemented">Partially Implemented</option>
          <option value="implemented">Implemented</option>
          <option value="not_applicable">Not Applicable</option>
        </select>
      </div>
      
      <div className="control-evidence">
        <h3>Evidence</h3>
        {control.evidence && control.evidence.length > 0 ? (
          <ul>
            {control.evidence.map((item, index) => (
              <li key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.name || `Evidence ${index + 1}`}
                </a>
                <span> - {item.description}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No evidence attached</p>
        )}
      </div>
    </div>
  );
};

export default ControlDetail;