import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Récupération des frameworks avec vérifications flexibles
export const getFrameworks = async () => {
  try {
    console.log('[DEBUG] Envoi requête à:', `${API_URL}/frameworks`);
    const response = await axios.get(`${API_URL}/frameworks`);
    console.log('[DEBUG] Réponse complète:', response.data);

    // Accepter différentes structures de réponse
    const data = response.data?.data?.frameworks ||
                 response.data?.data ||
                 response.data?.frameworks ||
                 response.data;

    if (!Array.isArray(data)) {
      throw new Error('Un tableau de frameworks était attendu');
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des frameworks:', error);
    throw error;
  }
};

export const getFrameworkControls = async (frameworkId) => {
  try {
    if (!frameworkId) throw new Error('Framework ID is undefined');

    console.log(`[API] Fetching controls for framework ${frameworkId}`);
    
    const response = await axios({
      method: 'get',
      url: `/api/controls/frameworks/${frameworkId}/controls`,
      headers: {
        'authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      timeout: 10000
    });

    if (!response.data?.data?.controls) {
      throw new Error('Invalid response structure');
    }

    return response.data.data.controls;
  } catch (error) {
    console.error('[API ERROR]', {
      message: error.message,
      code: error.code,
      response: error.response?.data
    });
    throw error;
  }
};


// ✅ Récupérer les statistiques de progression d’un framework
export const getFrameworkProgress = async (frameworkId) => {
  try {
    const response = await axios.get(`${API_URL}/frameworks/${frameworkId}/progress`);
    const data = response.data?.data;

    if (!response.data?.success || !data) {
      throw new Error('Invalid progress data structure');
    }

    return {
      implemented: data.implemented || 0,
      partial: data.partial || 0,
      notImplemented: data.notImplemented || 0,
      notApplicable: data.notApplicable || 0,
      overallProgress: data.overallProgress || 0,
      totalControls: data.totalControls || 0
    };
  } catch (err) {
    console.error('Error fetching progress:', err);
    throw err;
  }
};

// ✅ Détail d’un contrôle
export const getControlDetails = async (controlId) => {
  const res = await axios.get(`${API_URL}/controls/${controlId}`);
  return res.data?.data?.control;
};

// ✅ Mise à jour du statut d’un contrôle
export const updateControlStatus = async (controlId, status) => {
  const res = await axios.put(`${API_URL}/controls/${controlId}/status`, { status });
  return res.data?.data || res.data;
};
