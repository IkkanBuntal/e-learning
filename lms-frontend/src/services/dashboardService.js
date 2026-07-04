import api from './api';

// Simple in-memory cache with period support
const cache = {
  stats: {},
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

/**
 * Get dashboard stats (with caching and period filter)
 * @param {string} period - Time period filter: 'today', 'week', 'month', 'year'
 * @returns {Promise}
 */
export const getStats = async (period = 'today') => {
  try {
    const now = Date.now();
    const cacheKey = period;
    
    // Check if cache is still valid for this period
    if (cache.stats[cacheKey] && cache.stats[cacheKey].timestamp && 
        (now - cache.stats[cacheKey].timestamp < cache.CACHE_DURATION)) {
      console.log(`📦 Using cached dashboard stats for ${period}`);
      return cache.stats[cacheKey].data; // Return the cached data directly
    }
    
    // Fetch fresh data with period parameter
    console.log(`🌐 Fetching fresh dashboard stats for ${period}`);
    const response = await api.get('/dashboard/stats', {
      params: { period }
    });
    
    // Backend response structure: { status: 'success', data: {...} }
    // axios already parsed response.data, so response.data = { status: 'success', data: {...} }
    const apiData = response.data;
    
    // Update cache for this period
    cache.stats[cacheKey] = {
      data: apiData,
      timestamp: now
    };
    
    return apiData; // Return { status: 'success', data: {...} }
  } catch (error) {
    // If API fails but we have cached data for this period, return it
    if (cache.stats[period] && cache.stats[period].data) {
      console.log('⚠️ API failed, using cached data');
      return cache.stats[period].data;
    }
    throw error.response?.data || error;
  }
};

/**
 * Clear dashboard cache (useful after data updates)
 * @param {string} period - Specific period to clear, or clear all if not specified
 */
export const clearCache = (period = null) => {
  if (period) {
    delete cache.stats[period];
  } else {
    cache.stats = {};
  }
};

/**
 * Get student report data
 * @param {Object} params - Filtering params (jurusan, kelas, search)
 * @returns {Promise}
 */
export const getLaporanSiswa = async (params = {}) => {
  try {
    const response = await api.get('/laporan/siswa', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getLaporanGuru = async (params = {}) => {
  try {
    const response = await api.get('/laporan/guru', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const dashboardService = {
  getStats,
  getLaporanSiswa,
  getLaporanGuru,
  clearCache,
};

export default dashboardService;
