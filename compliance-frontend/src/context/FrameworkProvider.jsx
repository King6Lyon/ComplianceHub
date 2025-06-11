import { useState } from 'react';
import { FrameworkContext } from './framework-state';

export const FrameworkProvider = ({ children }) => {
  const [frameworks, setFrameworks] = useState([]);
  
  return (
    <FrameworkContext.Provider value={{ frameworks, setFrameworks }}>
      {children}
    </FrameworkContext.Provider>
  );
};