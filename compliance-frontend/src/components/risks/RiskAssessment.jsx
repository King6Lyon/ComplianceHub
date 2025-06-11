import React, { useState, useEffect } from 'react';
import { getRisks, createRisk, updateRisk } from '../../api/risks';
import Alert from '../common/Alert';
import Modal from '../common/Modal';

const RiskAssessment = () => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'security',
    likelihood: 'medium',
    impact: 'medium',
    controls: []
  });

  useEffect(() => {
    const loadRisks = async () => {
      try {
        const data = await getRisks();
        setRisks(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load risks');
      } finally {
        setLoading(false);
      }
    };
    loadRisks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRisk = await createRisk(formData);
      setRisks([...risks, newRisk]);
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'security',
        likelihood: 'medium',
        impact: 'medium',
        controls: []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create risk');
    }
  };

  const handleMitigation = async (riskId, controls) => {
    try {
      const updatedRisk = await updateRisk(riskId, { controls });
      setRisks(risks.map(r => r.id === riskId ? updatedRisk : r));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update risk');
    }
  };

  if (loading) return <div>Loading risks...</div>;

  return (
    <div className="risk-assessment">
      <h2>Risk Assessment</h2>
      {error && <Alert type="error" message={error} />}
      
      <button onClick={() => setShowModal(true)} className="add-risk-btn">
        Add New Risk
      </button>
      
      <div className="risk-list">
        {risks.length === 0 ? (
          <p>No risks identified yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Likelihood</th>
                <th>Impact</th>
                <th>Risk Level</th>
                <th>Mitigating Controls</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {risks.map(risk => (
                <tr key={risk.id}>
                  <td>{risk.name}</td>
                  <td>{risk.category}</td>
                  <td>{risk.likelihood}</td>
                  <td>{risk.impact}</td>
                  <td>
                    <span className={`risk-level ${risk.level}`}>
                      {risk.level}
                    </span>
                  </td>
                  <td>
                    {risk.controls.length > 0 ? (
                      <ul>
                        {risk.controls.map(control => (
                          <li key={control.id}>{control.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="no-controls">No controls assigned</span>
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleMitigation(risk.id, ['control1', 'control2'])}
                      className="assign-controls-btn"
                    >
                      Assign Controls
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h3>Add New Risk</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Risk Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="security">Security</option>
              <option value="privacy">Privacy</option>
              <option value="compliance">Compliance</option>
              <option value="operational">Operational</option>
            </select>
          </div>
          <div className="form-group">
            <label>Likelihood</label>
            <select
              name="likelihood"
              value={formData.likelihood}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Impact</label>
            <select
              name="impact"
              value={formData.impact}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit">Save Risk</button>
        </form>
      </Modal>
    </div>
  );
};

export default RiskAssessment;