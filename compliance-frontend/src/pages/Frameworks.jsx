import React from 'react';
import FrameworkSelector from '../components/frameworks/FrameworkSelector';
import ControlList from '../components/frameworks/ControlList';

const Frameworks = () => {
  return (
    <div className="frameworks-page">
      <h1>Compliance Frameworks</h1>
      <FrameworkSelector />
      <ControlList />
    </div>
  );
};

export default Frameworks;