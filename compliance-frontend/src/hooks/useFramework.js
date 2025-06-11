import { useState, useEffect } from 'react';
import { getFrameworks, getFrameworkControls } from '../api/frameworks';

export const useFramework = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [currentFramework, setCurrentFramework] = useState(null);
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFrameworks = async () => {
      try {
        setLoading(true);
        const data = await getFrameworks();
        setFrameworks(data);
        if (data.length > 0) {
          setCurrentFramework(data[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load frameworks');
      } finally {
        setLoading(false);
      }
    };
    loadFrameworks();
  }, []);

  useEffect(() => {
    const loadControls = async () => {
      if (!currentFramework) return;
      
      try {
        setLoading(true);
        const data = await getFrameworkControls(currentFramework.id);
        setControls(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load controls');
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
    error
  };
};