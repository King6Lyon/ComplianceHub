import { useState, useEffect } from 'react';
import { getFrameworks, getFrameworkControls } from '../api/frameworks';

export const useFramework = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [currentFramework, setCurrentFramework] = useState(null);
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chargement des frameworks
  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        setLoading(true);
        const data = await getFrameworks();

        if (Array.isArray(data)) {
          setFrameworks(data);
          if (data.length > 0) {
            setCurrentFramework(data[0]);
          }
        } else {
          console.warn('getFrameworks() did not return an array:', data);
          setFrameworks([]); // éviter map sur undefined
        }

      } catch (err) {
        console.error('Erreur lors du chargement des frameworks:', err);
        setError(err?.response?.data?.message || 'Échec du chargement des frameworks');
      } finally {
        setLoading(false);
      }
    };

    loadFrameworks();
  }, []);

  // Chargement des contrôles du framework sélectionné
  useEffect(() => {
    const loadControls = async () => {
      if (!currentFramework || !currentFramework.id) return;

      try {
        setLoading(true);
        const data = await getFrameworkControls(currentFramework.id);

        if (Array.isArray(data)) {
          setControls(data);
        } else {
          console.warn('getFrameworkControls() did not return an array:', data);
          setControls([]);
        }

      } catch (err) {
        console.error('Erreur lors du chargement des contrôles:', err);
        setError(err?.response?.data?.message || 'Échec du chargement des contrôles');
      } finally {
        setLoading(false);
      }
    };

    loadControls();
  }, [currentFramework]);

  return {
    frameworks,
    currentFramework,
    setCurrentFramework,
    controls,
    loading,
    error,
  };
};
