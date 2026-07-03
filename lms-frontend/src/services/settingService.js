import api from './api';

/**
 * Get system settings
 * @returns {Promise}
 */
export const getSettings = async () => {
  try {
    const response = await api.get('/setting');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update system settings
 * @param {Object} data - Settings data
 * @returns {Promise}
 */
export const updateSettings = async (data) => {
  try {
    const response = await api.put('/setting', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const settingService = {
  getSettings,
  updateSettings,
};

export default settingService;
