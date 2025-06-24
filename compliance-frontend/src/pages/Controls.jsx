import React from 'react';
import { useParams } from 'react-router-dom';
import ControlDetail from '../components/frameworks/ControlDetail';

const ControlDetailPage = () => {
  const { id } = useParams();

  if (!id) {
    return <div className="text-red-600 font-semibold p-4">Aucun identifiant de contrôle fourni</div>;
  }

  return (
    <div className="controls-page p-4">
      <ControlDetail controlId={id} />
    </div>
  );
};

export default ControlDetailPage;
