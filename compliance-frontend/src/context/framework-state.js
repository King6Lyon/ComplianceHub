import { createContext, useContext } from 'react';

// Création du contexte
export const FrameworkContext = createContext();

// Hook personnalisé pour consommer le contexte
export const useFramework = () => {
  const context = useContext(FrameworkContext);
  if (!context) {
    throw new Error('useFramework must be used within a FrameworkProvider');
  }
  return context;
};
