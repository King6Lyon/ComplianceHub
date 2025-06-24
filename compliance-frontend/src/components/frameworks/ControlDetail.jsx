import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getControlDetails, updateControlStatus } from '../../api/frameworks';
import Alert from '../common/Alert';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const ControlDetail = () => {
  const { id } = useParams();
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
        setControl({
          ...data,
          refId: data.controlId,
          name: data.title
        });
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
      await updateControlStatus(control._id, newStatus);
      setStatus(newStatus);
      setControl({ ...control, status: newStatus });
      setUpdateSuccess('Statut du contrôle mis à jour.');
      setTimeout(() => setUpdateSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) return <div className="p-4">Chargement des détails du contrôle...</div>;
  if (error) return <Alert type="error" message={error} />;
  if (!control) return <div className="p-4">Contrôle non trouvé</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {control.refId} – {control.name}
          </h2>
        </div>
        <Link
          to="/frameworks"
          className="flex items-center text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour aux Frameworks
        </Link>
      </div>

      {updateSuccess && <Alert type="success" message={updateSuccess} />}

      <div className="bg-white p-6 rounded-2xl shadow">
        <p className="mb-4">
          <strong>Description :</strong> {control.description}
        </p>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Statut :</label>
          <select
            className="p-2 border border-gray-300 rounded-md max-w-xs"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="non démarré">Non démarré</option>
            <option value="en cours">En cours</option>
            <option value="terminé">Terminé</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ControlDetail;
