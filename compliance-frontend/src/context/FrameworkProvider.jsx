import { useState, useEffect, useCallback } from 'react';
import { FrameworkContext } from './framework-state';
import { getFrameworks, getFrameworkControls } from '../api/frameworks';

const FrameworkProvider = ({ children }) => {
  const [frameworks, setFrameworks] = useState([]);
  // Modifiez l'initialisation pour lire depuis localStorage
  const [currentFramework, setCurrentFramework] = useState(() => {
    const saved = localStorage.getItem('selectedFramework');
    return saved ? JSON.parse(saved) : null;
  });
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);

  // Créez une version sécurisée de setCurrentFramework
  const handleSetFramework = useCallback((framework) => {
    localStorage.setItem('selectedFramework', JSON.stringify(framework));
    setCurrentFramework(framework);
  }, []);

  useEffect(() => {
  const abortController = new AbortController();

  const loadControls = async () => {
    if (!currentFramework?._id) {
      console.log('Skipping load - no framework ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log(`Loading controls for ${currentFramework._id}`);
      const response = await getFrameworkControls(currentFramework._id);
      
      console.log('Controls loaded:', response.length);
      setControls(response);
      
    } catch (err) {
      console.error('Load error:', {
        message: err.message,
        stack: err.stack
      });
      
      if (err.code === 'ECONNABORTED') {
        setError('Le serveur met trop de temps à répondre. Vérifiez votre connexion.');
      } else {
        setError(err.message || 'Erreur de chargement');
      }
    } finally {
      setLoading(false);
    }
  };

  loadControls();

  return () => abortController.abort();
}, [currentFramework?._id]);

  // Chargement des frameworks
  const loadFrameworks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getFrameworks();
      
      if (!response || !Array.isArray(response)) {
        throw new Error('Données des frameworks invalides reçues');
      }

      setFrameworks(response);
      
      // Si aucun framework n'est sélectionné mais qu'il y a des frameworks disponibles
      if (!currentFramework && response.length > 0) {
        // Soit prendre le premier, soit celui sauvegardé dans localStorage
        const savedFrameworkId = currentFramework?._id;
        const selected = savedFrameworkId 
          ? response.find(f => f._id === savedFrameworkId) 
          : response[0];
        handleSetFramework(selected);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des frameworks:', err);
      setError(err.message || 'Échec du chargement des frameworks');
      setTimeout(loadFrameworks, 5000);
    } finally {
      setLoading(false);
      setInitialLoad(true);
    }
  }, [currentFramework, handleSetFramework]);

  // Chargement initial
  useEffect(() => {
    if (!initialLoad && frameworks.length === 0) {
      loadFrameworks();
    }
  }, [initialLoad, frameworks.length, loadFrameworks]);

  // Chargement des contrôles
  useEffect(() => {
    const loadControls = async () => {
      if (!currentFramework?._id) {
        console.log('Aucun framework sélectionné');
        setControls([]); // Réinitialise les contrôles si aucun framework
        return;
      }

      try {
        setLoading(true);
        console.log(`Chargement des contrôles pour le framework ${currentFramework._id}`);
        const response = await getFrameworkControls(currentFramework._id);
        console.log('Réponse des contrôles:', response);
        
        if (!Array.isArray(response)) {
          throw new Error('Structure de données invalide pour les contrôles');
        }

        setControls(response);
      } catch (err) {
        console.error('Erreur de chargement des contrôles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadControls();
  }, [currentFramework]);

  return (
    <FrameworkContext.Provider
      value={{
        frameworks,
        currentFramework,
        setCurrentFramework: handleSetFramework, // Utilisez la version sécurisée
        controls,
        loading,
        error,
        loadFrameworks
      }}
    >
      {children}
    </FrameworkContext.Provider>
  );
};

export default FrameworkProvider;