import api from './api';

/**
 * Cache Management API Service
 * Admin-only endpoints for Redis cache management
 */

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  const response = await api.get('/cache/stats');
  return response.data;
};

/**
 * Clear all cache
 */
export const clearAllCache = async () => {
  const response = await api.post('/cache/clear');
  return response.data;
};

/**
 * Clear cache by pattern
 * @param {string} pattern - Cache key pattern to match (e.g., "dashboard:*")
 */
export const clearCacheByPattern = async (pattern) => {
  const response = await api.post('/cache/clear-pattern', { pattern });
  return response.data;
};

/**
 * Clear cache by type
 * @param {string} type - Cache type (dashboard, jadwal, kelas, materi, tugas, nilai, absensi)
 */
export const clearCacheByType = async (type) => {
  const response = await api.post(`/cache/clear/${type}`);
  return response.data;
};

/**
 * Format cache statistics for display
 */
export const formatCacheStats = (stats) => {
  if (!stats.connected) {
    return {
      status: 'Disconnected',
      error: stats.error || 'Unknown error',
    };
  }

  return {
    status: 'Connected',
    memory: stats.used_memory,
    totalKeys: stats.total_keys?.toLocaleString() || '0',
    hits: stats.hits?.toLocaleString() || '0',
    misses: stats.misses?.toLocaleString() || '0',
    hitRate: stats.hit_rate || '0%',
  };
};

export default {
  getCacheStats,
  clearAllCache,
  clearCacheByPattern,
  clearCacheByType,
  formatCacheStats,
};
