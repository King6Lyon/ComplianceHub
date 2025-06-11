import { createContext, useContext } from 'react';

export const FrameworkContext = createContext(null); // Initialisez avec une valeur par défaut

export const useFramework = () => {
  const context = useContext(FrameworkContext);
  if (!context) {
    throw new Error('useFramework must be used within a FrameworkProvider');
  }
  return context;
};