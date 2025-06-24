import React, { useEffect, useState } from 'react';
import { useFramework } from '../../context/framework-state';
import { getFrameworkControls } from '../../api/frameworks';
import Alert from '../common/Alert';
import { Link } from 'react-router-dom';
import { ClipboardList, Eye } from 'lucide-react';

const ControlList = () => {
  const { currentFramework } = useFramework();
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentFramework || !currentFramework._id) {
      return;
    }

    const loadControls = async () => {
      try {

        console.log("dddd",currentFramework._id)

        setLoading(true);
        const data = await getFrameworkControls(currentFramework._id);
      
        console.log('Ma liste de data',data)
        setControls(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Échec du chargement des contrôles');
      } finally {
        setLoading(false);
      }
    };

    loadControls();
  }, [currentFramework]);

  if (!currentFramework) {
    return <div className="text-center text-gray-500">Veuillez sélectionner un framework.</div>;
  }

  if (loading) {
    return <div className="text-center text-blue-500">Chargement des contrôles...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="text-blue-600" />
        <h2 className="text-xl font-semibold">
          Contrôles – {currentFramework.name}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {controls.filter((el)=> el.frameworkId == currentFramework._id).map((control) => (
              <tr key={control._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-blue-600">{control.refId}</td>
                <td className="px-4 py-2">{control.name}</td>
                <td className="px-4 py-2 text-gray-500">
                  {control.description?.substring(0, 60)}...
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      control.status === 'compliant'
                        ? 'bg-green-100 text-green-700'
                        : control.status === 'non-compliant'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {control.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link
                    to={`/controls/${control._id}`}
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    <Eye className="w-4 h-4 mr-1" /> Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControlList;
