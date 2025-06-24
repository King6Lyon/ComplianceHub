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

  if (loading) return <div className="p-6 text-gray-600">Loading risks...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Risk Assessment</h2>
      {error && <Alert type="error" message={error} />}

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add New Risk
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Likelihood</th>
              <th className="px-4 py-2 border">Impact</th>
              <th className="px-4 py-2 border">Risk Level</th>
              <th className="px-4 py-2 border">Mitigating Controls</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {risks.map(risk => (
              <tr key={risk.id} className="border-t">
                <td className="px-4 py-2 border font-medium text-gray-700">{risk.name}</td>
                <td className="px-4 py-2 border">{risk.category}</td>
                <td className="px-4 py-2 border">{risk.likelihood}</td>
                <td className="px-4 py-2 border">{risk.impact}</td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    risk.level === 'high' ? 'bg-red-100 text-red-800' :
                    risk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.level}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {risk.controls.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {risk.controls.map(control => (
                        <li key={control.id}>{control.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 italic">No controls assigned</span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleMitigation(risk.id, ['control1', 'control2'])}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Assign Controls
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold mb-4">Add New Risk</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="security">Security</option>
              <option value="privacy">Privacy</option>
              <option value="compliance">Compliance</option>
              <option value="operational">Operational</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Likelihood</label>
              <select
                name="likelihood"
                value={formData.likelihood}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Impact</label>
              <select
                name="impact"
                value={formData.impact}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Risk
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RiskAssessment;
