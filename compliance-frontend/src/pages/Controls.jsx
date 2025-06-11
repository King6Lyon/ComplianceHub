import React from 'react';
import { useParams } from 'react-router-dom';
import ControlDetail from '../components/frameworks/ControlDetail';

const Controls = () => {
  const { id: _id } = useParams();
  
  return (
    <div className="controls-page">
      <ControlDetail />
    </div>
  );
};

export default Controls;